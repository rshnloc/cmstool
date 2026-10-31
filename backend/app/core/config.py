import os
from pathlib import Path
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "Chronicle CMS"
    PROJECT_VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Generic dev secret key; override via environment variable CMS_SECRET_KEY in production
    SECRET_KEY: str = os.getenv("CMS_SECRET_KEY", "dev-insecure-secret-key-replace-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    
    # SQLite Database location
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        f"sqlite:///{BASE_DIR / 'data' / 'cms.db'}"
    )
    
    # Uploads directory
    UPLOAD_DIR: Path = BASE_DIR / "uploads"
    
    # CORS Origins
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    class Config:
        env_prefix = "CMS_"

settings = Settings()
