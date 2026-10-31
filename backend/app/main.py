from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.database import Base, engine
from app.routers import auth, posts, pages, categories, media, settings as cms_settings, public, analytics

# Create database tables automatically
Base.metadata.create_all(bind=engine)

# Ensure upload directory exists
settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="Modern Content Management System (CMS) & Headless Content Delivery Engine",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for media uploads
app.mount("/uploads", StaticFiles(directory=str(settings.UPLOAD_DIR)), name="uploads")

# Include API Routers under /api
api_prefix = settings.API_PREFIX
app.include_router(auth.router, prefix=api_prefix)
app.include_router(posts.router, prefix=api_prefix)
app.include_router(pages.router, prefix=api_prefix)
app.include_router(categories.router, prefix=api_prefix)
app.include_router(media.router, prefix=api_prefix)
app.include_router(cms_settings.router, prefix=api_prefix)
app.include_router(public.router, prefix=api_prefix)
app.include_router(analytics.router, prefix=api_prefix)

@app.get("/")
def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "status": "online",
        "documentation": "/docs",
        "api_prefix": settings.API_PREFIX,
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}
