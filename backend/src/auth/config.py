import os

class Settings:
    PROJECT_NAME: str = "Auth Microservice"
    VERSION: str = "1.0.0"
    
    DATABASE_URL: str = os.getenv("AUTH_DATABASE_URL", "sqlite:///./auth.db")
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "auth-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    ALLOWED_ORIGINS: list = ["http://localhost:3000", "http://localhost:8080", "http://localhost:8001", "http://localhost:8002"]
    
    AUTH_HOST: str = os.getenv("AUTH_HOST", "localhost")
    AUTH_PORT: int = int(os.getenv("AUTH_PORT", "8000"))

settings = Settings() 