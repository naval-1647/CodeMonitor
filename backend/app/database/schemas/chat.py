from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Literal
from datetime import datetime
from bson import ObjectId


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ChatHistoryCreate(BaseModel):
    prompt: str
    response: str
    mode: Literal["generate", "debug", "explain"]
    code_context: Optional[str] = None


class ChatHistoryInDB(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True
    )
    
    id: Optional[str] = Field(alias="_id", default=None)
    user_id: str
    messages: list[ChatMessage] = []
    mode: str
    code_context: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ChatHistoryResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    
    id: str
    messages: list[ChatMessage]
    mode: str
    code_context: Optional[str] = None
    created_at: datetime
