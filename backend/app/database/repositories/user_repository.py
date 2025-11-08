from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from app.database.connection import get_database
from app.database.schemas.user import UserInDB


class UserRepository:
    collection_name = "users"

    @staticmethod
    async def create_user(user_data: dict) -> UserInDB:
        """Create a new user"""
        db = get_database()
        result = await db[UserRepository.collection_name].insert_one(user_data)
        user_data["_id"] = str(result.inserted_id)
        return UserInDB(**user_data)

    @staticmethod
    async def get_user_by_email(email: str) -> Optional[UserInDB]:
        """Get user by email"""
        db = get_database()
        user = await db[UserRepository.collection_name].find_one({"email": email})
        if user:
            user["_id"] = str(user["_id"])
            return UserInDB(**user)
        return None

    @staticmethod
    async def get_user_by_id(user_id: str) -> Optional[UserInDB]:
        """Get user by ID"""
        db = get_database()
        try:
            user = await db[UserRepository.collection_name].find_one({"_id": ObjectId(user_id)})
            if user:
                user["_id"] = str(user["_id"])
                return UserInDB(**user)
        except Exception:
            pass
        return None

    @staticmethod
    async def user_exists(email: str) -> bool:
        """Check if user exists"""
        db = get_database()
        count = await db[UserRepository.collection_name].count_documents({"email": email})
        return count > 0
