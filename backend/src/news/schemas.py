from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import datetime

class NewsBase(BaseModel):
    name: str
    content: str
    description: Optional[str] = None
    image: Optional[str] = None

class NewsCreate(NewsBase):
    @field_validator('name')
    def validate_name(cls, v):
        if not v:
            raise ValueError('Name cannot be empty')
        return v
    
    @field_validator('content')
    def validate_content(cls, v):
        if not v:
            raise ValueError('Content cannot be empty')
        return v

class NewsUpdate(BaseModel):
    name: Optional[str] = None
    content: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None

class News(NewsBase):
    id: int
    created_at: datetime
    author_id: int
    
    class Config:
        from_attributes = True

class NewsResponse(BaseModel):
    id: int
    name: str
    content: str
    description: Optional[str]
    image: Optional[str]
    created_at: datetime
    author_id: int
    author_username: Optional[str] = None
    
    class Config:
        from_attributes = True

class NewsListResponse(BaseModel):
    news: List[NewsResponse]
    total: int
    page: int
    size: int 