from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field
from typing import Optional, Literal
from app.dependencies import get_current_user
from app.database.schemas.user import UserInDB
from app.database.repositories import ChatRepository
from app.utils.openai_helper import generate_code, debug_code, explain_code
from app.utils.rate_limiter import rate_limiter
from app.database.schemas.chat import ChatMessage

router = APIRouter(prefix="/api/ai", tags=["AI"])


class AIPromptRequest(BaseModel):
    prompt: str = Field(..., min_length=1)
    mode: Literal["generate", "debug", "explain"]
    code_context: Optional[str] = None
    language: str = "python"


@router.post("/prompt", response_model=dict)
async def ai_prompt(
    request: AIPromptRequest,
    current_user: UserInDB = Depends(get_current_user)
):
    """Process AI prompt with different modes"""
    # Check rate limit
    if not rate_limiter.is_allowed(str(current_user.id)):
        remaining = rate_limiter.get_remaining_requests(str(current_user.id))
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit exceeded. Remaining requests: {remaining}"
        )
    
    try:
        # Generate AI response based on mode
        if request.mode == "generate":
            ai_response = await generate_code(request.prompt, request.language)
        elif request.mode == "debug":
            if not request.code_context:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="code_context is required for debug mode"
                )
            ai_response = await debug_code(request.code_context, request.prompt)
        else:  # explain
            if not request.code_context:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="code_context is required for explain mode"
                )
            ai_response = await explain_code(request.code_context)
        
        # Save to chat history
        chat_data = {
            "user_id": str(current_user.id),
            "messages": [
                ChatMessage(role="user", content=request.prompt).dict(),
                ChatMessage(role="assistant", content=ai_response).dict()
            ],
            "mode": request.mode,
            "code_context": request.code_context
        }
        
        chat_history = await ChatRepository.create_chat_history(chat_data)
        
        remaining = rate_limiter.get_remaining_requests(str(current_user.id))
        
        return {
            "status": "success",
            "message": "AI response generated successfully",
            "data": {
                "response": ai_response,
                "chat_id": str(chat_history.id),
                "mode": request.mode,
                "remaining_requests": remaining
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating AI response: {str(e)}"
        )


@router.get("/history", response_model=dict)
async def get_chat_history(
    skip: int = 0,
    limit: int = 50,
    current_user: UserInDB = Depends(get_current_user)
):
    """Get chat history for current user"""
    chats = await ChatRepository.get_user_chat_history(str(current_user.id), skip, limit)
    
    return {
        "status": "success",
        "message": "Chat history retrieved successfully",
        "data": [
            {
                "id": str(chat.id),
                "messages": [
                    {
                        "role": msg.role,
                        "content": msg.content,
                        "timestamp": msg.timestamp.isoformat()
                    }
                    for msg in chat.messages
                ],
                "mode": chat.mode,
                "code_context": chat.code_context,
                "created_at": chat.created_at.isoformat()
            }
            for chat in chats
        ]
    }


@router.delete("/history/{chat_id}", response_model=dict)
async def delete_chat_history(
    chat_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    """Delete a chat history entry"""
    success = await ChatRepository.delete_chat_history(chat_id, str(current_user.id))
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat history not found"
        )
    
    return {
        "status": "success",
        "message": "Chat history deleted successfully",
        "data": None
    }


@router.get("/rate-limit", response_model=dict)
async def get_rate_limit_status(current_user: UserInDB = Depends(get_current_user)):
    """Get current rate limit status for user"""
    remaining = rate_limiter.get_remaining_requests(str(current_user.id))
    
    return {
        "status": "success",
        "message": "Rate limit status retrieved",
        "data": {
            "remaining_requests": remaining,
            "total_requests": 50,
            "window_minutes": 60
        }
    }
