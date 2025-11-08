from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime
from bson import ObjectId


class SnippetCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    code: str
    language: str = "python"
    description: Optional[str] = None
    tags: list[str] = []


class SnippetUpdate(BaseModel):
    title: Optional[str] = None
    code: Optional[str] = None
    language: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[list[str]] = None


class SnippetInDB(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True
    )
    
    id: Optional[str] = Field(alias="_id", default=None)
    user_id: str
    title: str
    code: str
    language: str
    description: Optional[str] = None
    tags: list[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class SnippetResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    
    id: str
    title: str
    code: str
    language: str
    description: Optional[str] = None
    tags: list[str] = []
    created_at: datetime
    updated_at: datetime
