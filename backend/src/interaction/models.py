from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, timezone
from .database import Base

class Interaction(Base):
    __tablename__ = "interactions"
    
    id = Column(Integer, primary_key=True, index=True)
    id_user = Column(Integer, nullable=False)
    id_news = Column(Integer, nullable=False)
    interaction_type = Column(String(20), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
