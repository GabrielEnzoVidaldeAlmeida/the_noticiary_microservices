import os

class Settings:
    PROJECT_NAME: str = "Interaction Microservice"
    VERSION: str = "1.0.0"
    
    DATABASE_URL: str = os.getenv("INTERACTION_DATABASE_URL", "sqlite:///./interactions.db")
    
    ALLOWED_ORIGINS: list = ["http://localhost:3000", "http://localhost:8080", "http://localhost:8000", "http://localhost:8001"]
    
    INTERACTION_HOST: str = os.getenv("INTERACTION_HOST", "localhost")
    INTERACTION_PORT: int = int(os.getenv("INTERACTION_PORT", "8002"))
    
    AUTH_SERVICE_URL: str = os.getenv("AUTH_SERVICE_URL", "http://localhost:8000")
    NEWS_SERVICE_URL: str = os.getenv("NEWS_SERVICE_URL", "http://localhost:8001")

settings = Settings() 