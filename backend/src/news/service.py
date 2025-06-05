from sqlalchemy.orm import Session
import httpx

from .models import News
from .schemas import NewsCreate, NewsUpdate
from .config import settings

class NewsService:
    
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
    def create_news(db: Session, news: NewsCreate, author_id: int):
        """Create new news"""
        db_news = News(
            name=news.name,
            content=news.content,
            description=news.description,
            image=news.image,
            author_id=author_id
        )
        db.add(db_news)
        db.commit()
        db.refresh(db_news)
        return db_news
    
    @staticmethod
    def get_news_by_id(db: Session, news_id: int):
        """Get news by ID"""
        return db.query(News).filter(News.id == news_id).first()
    
    @staticmethod
    def get_news_list(db: Session, skip: int = 0, limit: int = 10):
        """List news with pagination"""
        query = db.query(News)
        total = query.count()
        news_list = query.order_by(News.created_at.desc()).offset(skip).limit(limit).all()
        return news_list, total
    
    @staticmethod
    def update_news(db: Session, news_id: int, news_update: NewsUpdate):
        """Update news"""
        db_news = NewsService.get_news_by_id(db, news_id)
        if not db_news:
            return None
        
        update_data = news_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_news, field, value)
        
        db.commit()
        db.refresh(db_news)
        return db_news
    
    @staticmethod
    def delete_news(db: Session, news_id: int):
        """Delete news"""
        db_news = NewsService.get_news_by_id(db, news_id)
        if not db_news:
            return False
        
        db.delete(db_news)
        db.commit()
        return True
    
    @staticmethod
    def get_news_by_author(db: Session, author_id: int, skip: int = 0, limit: int = 10):
        """Get news by author"""
        query = db.query(News).filter(News.author_id == author_id)
        total = query.count()
        news_list = query.order_by(News.created_at.desc()).offset(skip).limit(limit).all()
        return news_list, total 