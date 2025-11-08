from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query, status
from typing import Dict, Set, Optional
import json
from datetime import datetime
from app.utils.auth import decode_access_token
from app.utils.openai_helper import stream_ai_response
from app.utils.rate_limiter import rate_limiter
from app.database.repositories import UserRepository, ChatRepository
from app.database.schemas.chat import ChatMessage

router = APIRouter(tags=["WebSocket"])


class ConnectionManager:
    """Manage WebSocket connections"""
    
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.rooms: Dict[str, Set[str]] = {}  # room_id -> set of user_ids
    
    async def connect(self, websocket: WebSocket, user_id: str):
        """Connect a user"""
        await websocket.accept()
        self.active_connections[user_id] = websocket
    
    def disconnect(self, user_id: str):
        """Disconnect a user"""
        if user_id in self.active_connections:
            del self.active_connections[user_id]
        
        # Remove from all rooms
        for room_users in self.rooms.values():
            room_users.discard(user_id)
    
    async def send_personal_message(self, message: str, user_id: str):
        """Send message to specific user"""
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_text(message)
    
    def join_room(self, room_id: str, user_id: str):
        """Add user to a room"""
        if room_id not in self.rooms:
            self.rooms[room_id] = set()
        self.rooms[room_id].add(user_id)
    
    def leave_room(self, room_id: str, user_id: str):
        """Remove user from a room"""
        if room_id in self.rooms:
            self.rooms[room_id].discard(user_id)
            if not self.rooms[room_id]:
                del self.rooms[room_id]
    
    async def broadcast_to_room(self, room_id: str, message: str, exclude_user: Optional[str] = None):
        """Broadcast message to all users in a room"""
        if room_id in self.rooms:
            for user_id in self.rooms[room_id]:
                if user_id != exclude_user and user_id in self.active_connections:
                    await self.active_connections[user_id].send_text(message)


manager = ConnectionManager()


@router.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket, token: str = Query(...)):
    """WebSocket endpoint for streaming AI chat responses"""
    # Authenticate user
    payload = decode_access_token(token)
    if not payload:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    
    user_id = payload.get("sub")
    if not user_id:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    
    user = await UserRepository.get_user_by_id(user_id)
    if not user:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    
    await manager.connect(websocket, user_id)
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            prompt = message_data.get("prompt")
            mode = message_data.get("mode", "generate")
            code_context = message_data.get("code_context")
            
            if not prompt:
                await websocket.send_json({
                    "type": "error",
                    "message": "Prompt is required"
                })
                continue
            
            # Check rate limit
            if not rate_limiter.is_allowed(user_id):
                remaining = rate_limiter.get_remaining_requests(user_id)
                await websocket.send_json({
                    "type": "error",
                    "message": f"Rate limit exceeded. Remaining: {remaining}"
                })
                continue
            
            # Send start signal
            await websocket.send_json({
                "type": "start",
                "message": "Generating response..."
            })
            
            # Stream AI response
            full_response = ""
            try:
                async for chunk in stream_ai_response(prompt, mode, code_context):
                    full_response += chunk
                    await websocket.send_json({
                        "type": "chunk",
                        "content": chunk
                    })
                
                # Send completion signal
                await websocket.send_json({
                    "type": "complete",
                    "message": "Response complete"
                })
                
                # Save to chat history
                chat_data = {
                    "user_id": user_id,
                    "messages": [
                        ChatMessage(role="user", content=prompt).dict(),
                        ChatMessage(role="assistant", content=full_response).dict()
                    ],
                    "mode": mode,
                    "code_context": code_context
                }
                
                chat_history = await ChatRepository.create_chat_history(chat_data)
                
                # Send chat ID
                await websocket.send_json({
                    "type": "chat_saved",
                    "chat_id": str(chat_history.id)
                })
                
            except Exception as e:
                await websocket.send_json({
                    "type": "error",
                    "message": f"Error generating response: {str(e)}"
                })
    
    except WebSocketDisconnect:
        manager.disconnect(user_id)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(user_id)


@router.websocket("/ws/team/{room_id}")
async def websocket_team(websocket: WebSocket, room_id: str, token: str = Query(...)):
    """WebSocket endpoint for team collaboration"""
    # Authenticate user
    payload = decode_access_token(token)
    if not payload:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    
    user_id = payload.get("sub")
    if not user_id:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    
    user = await UserRepository.get_user_by_id(user_id)
    if not user:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    
    await manager.connect(websocket, user_id)
    manager.join_room(room_id, user_id)
    
    # Notify room that user joined
    await manager.broadcast_to_room(
        room_id,
        json.dumps({
            "type": "user_joined",
            "user_id": user_id,
            "username": user.username,
            "timestamp": datetime.utcnow().isoformat()
        }),
        exclude_user=user_id
    )
    
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            message_type = message_data.get("type", "message")
            
            if message_type == "ai_prompt":
                # Handle AI prompt in team mode
                prompt = message_data.get("prompt")
                mode = message_data.get("mode", "generate")
                code_context = message_data.get("code_context")
                
                if not prompt:
                    continue
                
                # Check rate limit
                if not rate_limiter.is_allowed(user_id):
                    await websocket.send_json({
                        "type": "error",
                        "message": "Rate limit exceeded"
                    })
                    continue
                
                # Broadcast that AI is responding
                await manager.broadcast_to_room(
                    room_id,
                    json.dumps({
                        "type": "ai_start",
                        "user_id": user_id,
                        "username": user.username,
                        "prompt": prompt
                    })
                )
                
                # Stream AI response to all room members
                full_response = ""
                async for chunk in stream_ai_response(prompt, mode, code_context):
                    full_response += chunk
                    await manager.broadcast_to_room(
                        room_id,
                        json.dumps({
                            "type": "ai_chunk",
                            "content": chunk,
                            "user_id": user_id
                        })
                    )
                
                await manager.broadcast_to_room(
                    room_id,
                    json.dumps({
                        "type": "ai_complete",
                        "user_id": user_id,
                        "full_response": full_response
                    })
                )
                
            else:
                # Regular message - broadcast to room
                await manager.broadcast_to_room(
                    room_id,
                    json.dumps({
                        "type": "message",
                        "user_id": user_id,
                        "username": user.username,
                        "content": message_data.get("content", ""),
                        "timestamp": datetime.utcnow().isoformat()
                    }),
                    exclude_user=user_id
                )
    
    except WebSocketDisconnect:
        manager.leave_room(room_id, user_id)
        manager.disconnect(user_id)
        
        # Notify room that user left
        await manager.broadcast_to_room(
            room_id,
            json.dumps({
                "type": "user_left",
                "user_id": user_id,
                "username": user.username,
                "timestamp": datetime.utcnow().isoformat()
            })
        )
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.leave_room(room_id, user_id)
        manager.disconnect(user_id)
