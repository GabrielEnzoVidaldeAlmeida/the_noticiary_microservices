import os

class Settings:
    PROJECT_NAME: str = "News Microservice"
    VERSION: str = "1.0.0"
    
    DATABASE_URL: str = os.getenv("NEWS_DATABASE_URL", "sqlite:///./news.db")
    
    ALLOWED_ORIGINS: list = ["http://localhost:3000", "http://localhost:8080", "http://localhost:8000", "http://localhost:8002"]
    
    NEWS_HOST: str = os.getenv("NEWS_HOST", "localhost")
    NEWS_PORT: int = int(os.getenv("NEWS_PORT", "8001"))
    
    AUTH_SERVICE_URL: str = os.getenv("AUTH_SERVICE_URL", "http://localhost:8000")

settings = Settings() 