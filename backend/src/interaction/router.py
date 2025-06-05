from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from .database import get_db
from .dependencies import get_current_user
from .schemas import (
    InteractionCreate, InteractionResponse, InteractionStats, 
    UserInteractionStatus
)
from .service import InteractionService

router = APIRouter()

@router.post("/", response_model=Optional[InteractionResponse])
async def create_or_update_interaction(
    interaction: InteractionCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create or update interaction - works as toggle"""
    try:
        result = await InteractionService.create_or_update_interaction(
            db=db, interaction=interaction, user_id=current_user["id"]
        )
        
        if result is None:
            return None
        
        response = InteractionResponse(
            id=result.id,
            id_user=result.id_user,
            id_news=result.id_news,
            interaction_type=result.interaction_type,
            created_at=result.created_at,
            username=current_user["username"]
        )
        return response
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/stats/{news_id}", response_model=InteractionStats)
def get_news_stats(news_id: int, db: Session = Depends(get_db)):
    """Get interaction statistics of a news"""
    stats = InteractionService.get_news_interactions_stats(db=db, news_id=news_id)
    return stats

@router.get("/status/{news_id}", response_model=UserInteractionStatus)
async def get_user_interaction_status(
    news_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user interaction status with a news"""
    status_data = InteractionService.get_user_interaction_status(
        db=db, user_id=current_user["id"], news_id=news_id
    )
    return status_data

@router.get("/news/{news_id}", response_model=List[InteractionResponse])
async def get_interactions_by_news(
    news_id: int,
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """List interactions of a news"""
    skip = (page - 1) * size
    interactions, total = await InteractionService.get_interactions_by_news(
        db=db, news_id=news_id, skip=skip, limit=size
    )
    
    response_list = []
    for interaction in interactions:
        response = InteractionResponse(
            id=interaction["id"],
            id_user=interaction["id_user"],
            id_news=interaction["id_news"],
            interaction_type=interaction["interaction_type"],
            created_at=interaction["created_at"],
            username=interaction["username"]
        )
        response_list.append(response)
    
    return response_list

@router.get("/user/me", response_model=List[InteractionResponse])
async def get_my_interactions(
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=100),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List my interactions"""
    skip = (page - 1) * size
    interactions, total = InteractionService.get_user_interactions(
        db=db, user_id=current_user["id"], skip=skip, limit=size
    )
    
    response_list = []
    for interaction in interactions:
        response = InteractionResponse(
            id=interaction.id,
            id_user=interaction.id_user,
            id_news=interaction.id_news,
            interaction_type=interaction.interaction_type,
            created_at=interaction.created_at,
            username=current_user["username"]
        )
        response_list.append(response)
    
    return response_list

@router.delete("/{interaction_id}")
async def delete_interaction(
    interaction_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete interaction (only own user)"""
    success = InteractionService.delete_interaction(
        db=db, interaction_id=interaction_id, user_id=current_user["id"]
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interaction not found or not authorized"
        )
    
    return {"message": "Interaction deleted successfully"}

@router.post("/like/{news_id}")
async def like_news(
    news_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Like a news (shortcut)"""
    interaction = InteractionCreate(id_news=news_id, interaction_type="like")
    return await create_or_update_interaction(interaction, current_user, db)

@router.post("/dislike/{news_id}")
async def dislike_news(
    news_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Dislike a news (shortcut)"""
    interaction = InteractionCreate(id_news=news_id, interaction_type="dislike")
    return await create_or_update_interaction(interaction, current_user, db) 