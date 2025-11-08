from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from app.database.schemas import SnippetCreate, SnippetUpdate, SnippetResponse
from app.database.repositories import SnippetRepository
from app.dependencies import get_current_user
from app.database.schemas.user import UserInDB

router = APIRouter(prefix="/api/snippets", tags=["Snippets"])


@router.post("", response_model=dict)
async def create_snippet(
    snippet_data: SnippetCreate,
    current_user: UserInDB = Depends(get_current_user)
):
    """Create a new code snippet"""
    snippet_dict = snippet_data.dict()
    snippet_dict["user_id"] = str(current_user.id)
    
    snippet = await SnippetRepository.create_snippet(snippet_dict)
    
    return {
        "status": "success",
        "message": "Snippet created successfully",
        "data": {
            "id": str(snippet.id),
            "title": snippet.title,
            "code": snippet.code,
            "language": snippet.language,
            "description": snippet.description,
            "tags": snippet.tags,
            "created_at": snippet.created_at.isoformat(),
            "updated_at": snippet.updated_at.isoformat()
        }
    }


@router.get("", response_model=dict)
async def get_snippets(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    search: Optional[str] = None,
    current_user: UserInDB = Depends(get_current_user)
):
    """Get all snippets for current user"""
    if search:
        snippets = await SnippetRepository.search_snippets(str(current_user.id), search, skip, limit)
    else:
        snippets = await SnippetRepository.get_user_snippets(str(current_user.id), skip, limit)
    
    return {
        "status": "success",
        "message": "Snippets retrieved successfully",
        "data": [
            {
                "id": str(s.id),
                "title": s.title,
                "code": s.code,
                "language": s.language,
                "description": s.description,
                "tags": s.tags,
                "created_at": s.created_at.isoformat(),
                "updated_at": s.updated_at.isoformat()
            }
            for s in snippets
        ]
    }


@router.get("/{snippet_id}", response_model=dict)
async def get_snippet(
    snippet_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    """Get a specific snippet"""
    snippet = await SnippetRepository.get_snippet_by_id(snippet_id, str(current_user.id))
    if not snippet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Snippet not found"
        )
    
    return {
        "status": "success",
        "message": "Snippet retrieved successfully",
        "data": {
            "id": str(snippet.id),
            "title": snippet.title,
            "code": snippet.code,
            "language": snippet.language,
            "description": snippet.description,
            "tags": snippet.tags,
            "created_at": snippet.created_at.isoformat(),
            "updated_at": snippet.updated_at.isoformat()
        }
    }


@router.put("/{snippet_id}", response_model=dict)
async def update_snippet(
    snippet_id: str,
    snippet_data: SnippetUpdate,
    current_user: UserInDB = Depends(get_current_user)
):
    """Update a snippet"""
    update_data = {k: v for k, v in snippet_data.dict().items() if v is not None}
    
    snippet = await SnippetRepository.update_snippet(snippet_id, str(current_user.id), update_data)
    if not snippet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Snippet not found"
        )
    
    return {
        "status": "success",
        "message": "Snippet updated successfully",
        "data": {
            "id": str(snippet.id),
            "title": snippet.title,
            "code": snippet.code,
            "language": snippet.language,
            "description": snippet.description,
            "tags": snippet.tags,
            "created_at": snippet.created_at.isoformat(),
            "updated_at": snippet.updated_at.isoformat()
        }
    }


@router.delete("/{snippet_id}", response_model=dict)
async def delete_snippet(
    snippet_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    """Delete a snippet"""
    success = await SnippetRepository.delete_snippet(snippet_id, str(current_user.id))
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Snippet not found"
        )
    
    return {
        "status": "success",
        "message": "Snippet deleted successfully",
        "data": None
    }
