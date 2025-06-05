from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from .database import Base

class News(Base):
    __tablename__ = "news"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    description = Column(Text)
    image = Column(String(500))
    created_at = Column(DateTime, default=datetime.now(datetime.UTC))
    author_id = Column(Integer, nullable=False)