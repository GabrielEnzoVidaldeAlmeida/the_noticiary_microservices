from sqlalchemy.orm import Session
from sqlalchemy import and_
import httpx

from .models import Interaction
from .schemas import InteractionCreate
from .config import settings

class InteractionService:
    
    @staticmethod
    async def verify_news_exists(news_id: int) -> bool:
        """Verify if news exists in news service"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"{settings.NEWS_SERVICE_URL}/news/{news_id}")
                return response.status_code == 200
        except:
            return False
    
    @staticmethod
    async def get_user_info(user_id: int):
        """Get user info from auth service"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"{settings.AUTH_SERVICE_URL}/auth/user/{user_id}")
                if response.status_code == 200:
                    return response.json()
                return None
        except:
            return None
    
    @staticmethod
    async def create_or_update_interaction(db: Session, interaction: InteractionCreate, user_id: int):
        """Create or update interaction of user with a news"""
        news_exists = await InteractionService.verify_news_exists(interaction.id_news)
        if not news_exists:
            raise ValueError("News not found")
        
        existing_interaction = db.query(Interaction).filter(
            and_(Interaction.id_user == user_id, Interaction.id_news == interaction.id_news)
        ).first()
        
        if existing_interaction:
            if existing_interaction.interaction_type == interaction.interaction_type:
                db.delete(existing_interaction)
                db.commit()
                return None
            else:
                existing_interaction.interaction_type = interaction.interaction_type
                db.commit()
                db.refresh(existing_interaction)
                return existing_interaction
        else:
            db_interaction = Interaction(
                id_user=user_id,
                id_news=interaction.id_news,
                interaction_type=interaction.interaction_type
            )
            db.add(db_interaction)
            db.commit()
            db.refresh(db_interaction)
            return db_interaction
    
    @staticmethod
    def get_interaction_by_id(db: Session, interaction_id: int):
        """Get interaction by ID"""
        return db.query(Interaction).filter(Interaction.id == interaction_id).first()
    
    @staticmethod
    def get_user_interaction_on_news(db: Session, user_id: int, news_id: int):
        """Get specific user interaction on a news"""
        return db.query(Interaction).filter(
            and_(Interaction.id_user == user_id, Interaction.id_news == news_id)
        ).first()
    
    @staticmethod
    def get_news_interactions_stats(db: Session, news_id: int):
        """Get interaction statistics of a news"""
        likes_count = db.query(Interaction).filter(
            and_(Interaction.id_news == news_id, Interaction.interaction_type == "like")
        ).count()
        
        dislikes_count = db.query(Interaction).filter(
            and_(Interaction.id_news == news_id, Interaction.interaction_type == "dislike")
        ).count()
        
        return {
            "news_id": news_id,
            "likes_count": likes_count,
            "dislikes_count": dislikes_count,
            "total_interactions": likes_count + dislikes_count
        }
    
    @staticmethod
    def get_user_interaction_status(db: Session, user_id: int, news_id: int):
        """Get user interaction status with a news"""
        user_interaction = InteractionService.get_user_interaction_on_news(db, user_id, news_id)
        stats = InteractionService.get_news_interactions_stats(db, news_id)
        
        return {
            "news_id": news_id,
            "user_interaction": user_interaction.interaction_type if user_interaction else None,
            "likes_count": stats["likes_count"],
            "dislikes_count": stats["dislikes_count"]
        }
    
    @staticmethod
    async def get_interactions_by_news(db: Session, news_id: int, skip: int = 0, limit: int = 50):
        """List interactions of a news"""
        interactions = db.query(Interaction).filter(Interaction.id_news == news_id).offset(skip).limit(limit).all()
        total = db.query(Interaction).filter(Interaction.id_news == news_id).count()
        
        interactions_with_users = []
        for interaction in interactions:
            user_info = await InteractionService.get_user_info(interaction.id_user)
            interaction_data = {
                "id": interaction.id,
                "id_user": interaction.id_user,
                "id_news": interaction.id_news,
                "interaction_type": interaction.interaction_type,
                "created_at": interaction.created_at,
                "username": user_info["username"] if user_info else "Unknown"
            }
            interactions_with_users.append(interaction_data)
        
        return interactions_with_users, total
    
    @staticmethod
    def get_user_interactions(db: Session, user_id: int, skip: int = 0, limit: int = 50):
        """List user interactions"""
        query = db.query(Interaction).filter(Interaction.id_user == user_id)
        total = query.count()
        interactions = query.offset(skip).limit(limit).all()
        
        return interactions, total
    
    @staticmethod
    def delete_interaction(db: Session, interaction_id: int, user_id: int):
        """Delete interaction (only own user can delete)"""
        interaction = db.query(Interaction).filter(
            and_(Interaction.id == interaction_id, Interaction.id_user == user_id)
        ).first()
        
        if not interaction:
            return False
        
        db.delete(interaction)
        db.commit()
        return True 