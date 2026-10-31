from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.entities import Post, Page, Category, Media, User
from app.schemas.pydantic_models import DashboardStats, PostResponse

router = APIRouter(prefix="/analytics", tags=["CMS Analytics"])

@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Provides high-level dashboard metrics for editors and admins."""
    total_posts = db.query(func.count(Post.id)).scalar() or 0
    published_posts = db.query(func.count(Post.id)).filter(Post.status == "published").scalar() or 0
    draft_posts = db.query(func.count(Post.id)).filter(Post.status == "draft").scalar() or 0
    total_pages = db.query(func.count(Page.id)).scalar() or 0
    total_categories = db.query(func.count(Category.id)).scalar() or 0
    total_media = db.query(func.count(Media.id)).scalar() or 0
    total_views = db.query(func.sum(Post.views)).scalar() or 0

    recent_posts = (
        db.query(Post)
        .order_by(desc(Post.created_at))
        .limit(5)
        .all()
    )

    return DashboardStats(
        total_posts=total_posts,
        published_posts=published_posts,
        draft_posts=draft_posts,
        total_pages=total_pages,
        total_categories=total_categories,
        total_media=total_media,
        total_views=total_views,
        recent_posts=recent_posts,
    )
