from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from app.database.connection import get_database
from app.database.schemas.snippet import SnippetInDB


class SnippetRepository:
    collection_name = "snippets"

    @staticmethod
    async def create_snippet(snippet_data: dict) -> SnippetInDB:
        """Create a new snippet"""
        db = get_database()
        snippet_data["created_at"] = datetime.utcnow()
        snippet_data["updated_at"] = datetime.utcnow()
        result = await db[SnippetRepository.collection_name].insert_one(snippet_data)
        snippet_data["_id"] = str(result.inserted_id)
        return SnippetInDB(**snippet_data)

    @staticmethod
    async def get_snippet_by_id(snippet_id: str, user_id: str) -> Optional[SnippetInDB]:
        """Get snippet by ID for a specific user"""
        db = get_database()
        try:
            snippet = await db[SnippetRepository.collection_name].find_one({
                "_id": ObjectId(snippet_id),
                "user_id": user_id
            })
            if snippet:
                snippet["_id"] = str(snippet["_id"])
                return SnippetInDB(**snippet)
        except Exception:
            pass
        return None

    @staticmethod
    async def get_user_snippets(user_id: str, skip: int = 0, limit: int = 50) -> List[SnippetInDB]:
        """Get all snippets for a user"""
        db = get_database()
        cursor = db[SnippetRepository.collection_name].find({"user_id": user_id}).sort("created_at", -1).skip(skip).limit(limit)
        snippets = []
        async for snippet in cursor:
            snippet["_id"] = str(snippet["_id"])
            snippets.append(SnippetInDB(**snippet))
        return snippets

    @staticmethod
    async def update_snippet(snippet_id: str, user_id: str, update_data: dict) -> Optional[SnippetInDB]:
        """Update a snippet"""
        db = get_database()
        try:
            update_data["updated_at"] = datetime.utcnow()
            result = await db[SnippetRepository.collection_name].find_one_and_update(
                {"_id": ObjectId(snippet_id), "user_id": user_id},
                {"$set": update_data},
                return_document=True
            )
            if result:
                result["_id"] = str(result["_id"])
                return SnippetInDB(**result)
        except Exception:
            pass
        return None

    @staticmethod
    async def delete_snippet(snippet_id: str, user_id: str) -> bool:
        """Delete a snippet"""
        db = get_database()
        try:
            result = await db[SnippetRepository.collection_name].delete_one({
                "_id": ObjectId(snippet_id),
                "user_id": user_id
            })
            return result.deleted_count > 0
        except Exception:
            pass
        return False

    @staticmethod
    async def search_snippets(user_id: str, query: str, skip: int = 0, limit: int = 50) -> List[SnippetInDB]:
        """Search snippets by title or tags"""
        db = get_database()
        cursor = db[SnippetRepository.collection_name].find({
            "user_id": user_id,
            "$or": [
                {"title": {"$regex": query, "$options": "i"}},
                {"tags": {"$in": [query]}}
            ]
        }).sort("created_at", -1).skip(skip).limit(limit)
        snippets = []
        async for snippet in cursor:
            snippet["_id"] = str(snippet["_id"])
            snippets.append(SnippetInDB(**snippet))
        return snippets
