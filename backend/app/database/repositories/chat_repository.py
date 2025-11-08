from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from app.database.connection import get_database
from app.database.schemas.chat import ChatHistoryInDB, ChatMessage


class ChatRepository:
    collection_name = "chat_history"

    @staticmethod
    async def create_chat_history(chat_data: dict) -> ChatHistoryInDB:
        """Create a new chat history entry"""
        db = get_database()
        chat_data["created_at"] = datetime.utcnow()
        result = await db[ChatRepository.collection_name].insert_one(chat_data)
        chat_data["_id"] = str(result.inserted_id)
        return ChatHistoryInDB(**chat_data)

    @staticmethod
    async def get_chat_history_by_id(chat_id: str, user_id: str) -> Optional[ChatHistoryInDB]:
        """Get chat history by ID for a specific user"""
        db = get_database()
        try:
            chat = await db[ChatRepository.collection_name].find_one({
                "_id": ObjectId(chat_id),
                "user_id": user_id
            })
            if chat:
                chat["_id"] = str(chat["_id"])
                return ChatHistoryInDB(**chat)
        except Exception:
            pass
        return None

    @staticmethod
    async def get_user_chat_history(user_id: str, skip: int = 0, limit: int = 50) -> List[ChatHistoryInDB]:
        """Get all chat history for a user"""
        db = get_database()
        cursor = db[ChatRepository.collection_name].find({"user_id": user_id}).sort("created_at", -1).skip(skip).limit(limit)
        chats = []
        async for chat in cursor:
            chat["_id"] = str(chat["_id"])
            chats.append(ChatHistoryInDB(**chat))
        return chats

    @staticmethod
    async def add_message_to_chat(chat_id: str, user_id: str, message: ChatMessage) -> Optional[ChatHistoryInDB]:
        """Add a message to existing chat history"""
        db = get_database()
        try:
            result = await db[ChatRepository.collection_name].find_one_and_update(
                {"_id": ObjectId(chat_id), "user_id": user_id},
                {"$push": {"messages": message.dict()}},
                return_document=True
            )
            if result:
                result["_id"] = str(result["_id"])
                return ChatHistoryInDB(**result)
        except Exception:
            pass
        return None

    @staticmethod
    async def delete_chat_history(chat_id: str, user_id: str) -> bool:
        """Delete a chat history entry"""
        db = get_database()
        try:
            result = await db[ChatRepository.collection_name].delete_one({
                "_id": ObjectId(chat_id),
                "user_id": user_id
            })
            return result.deleted_count > 0
        except Exception:
            pass
        return False
