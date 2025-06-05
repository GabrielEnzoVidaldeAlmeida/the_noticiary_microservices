from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import datetime

class InteractionBase(BaseModel):
    id_news: int
    interaction_type: str

class InteractionCreate(InteractionBase):
    @field_validator('interaction_type')
    def validate_interaction_type(cls, v):
        allowed_types = ["like", "dislike"]
        if v not in allowed_types:
            raise ValueError(f'Interaction type must be one of: {allowed_types}')
        return v

class InteractionUpdate(BaseModel):
    interaction_type: str
    
    @field_validator('interaction_type')
    def validate_interaction_type(cls, v):
        allowed_types = ["like", "dislike"]
        if v not in allowed_types:
            raise ValueError(f'Interaction type must be one of: {allowed_types}')
        return v

class Interaction(InteractionBase):
    id: int
    id_user: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class InteractionResponse(BaseModel):
    id: int
    id_user: int
    id_news: int
    interaction_type: str
    created_at: datetime
    username: Optional[str] = None
    
    class Config:
        from_attributes = True

class InteractionStats(BaseModel):
    news_id: int
    likes_count: int
    dislikes_count: int
    total_interactions: int

class UserInteractionStatus(BaseModel):
    news_id: int
    user_interaction: Optional[str] = None
    likes_count: int
    dislikes_count: int 