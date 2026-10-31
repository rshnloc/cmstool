from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.core.database import get_db
from app.models.entities import Post, Page, Category, Tag, Setting
from app.schemas.pydantic_models import (
    PostResponse,
    PostListResponse,
    PageResponse,
    CategoryResponse,
)

router = APIRouter(prefix="/public", tags=["Public Website API"])

@router.get("/settings", response_model=Dict[str, str])
def get_public_settings(db: Session = Depends(get_db)):
    """Returns key-value mapping of public site settings."""
    settings = db.query(Setting).all()
    return {s.key: s.value for s in settings}

@router.get("/categories", response_model=List[CategoryResponse])
def get_public_categories(db: Session = Depends(get_db)):
    """Lists categories that have at least one published post."""
    cats = db.query(Category).all()
    res = []
    for c in cats:
        count = db.query(Post).filter(Post.category_id == c.id, Post.status == "published").count()
        cat_data = CategoryResponse.model_validate(c)
        cat_data.post_count = count
        res.append(cat_data)
    return res

@router.get("/posts", response_model=PostListResponse)
def get_public_posts(
    category_slug: Optional[str] = Query(None),
    tag_slug: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(9, ge=1, le=50),
    db: Session = Depends(get_db),
):
    """Retrieves published posts for public website listing."""
    query = db.query(Post).filter(Post.status == "published")
    
    if category_slug:
        query = query.join(Post.category).filter(Category.slug == category_slug)
        
    if tag_slug:
        query = query.join(Post.tags).filter(Tag.slug == tag_slug)
        
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(Post.title.ilike(search_fmt) | Post.content.ilike(search_fmt) | Post.excerpt.ilike(search_fmt))

    total = query.count()
    items = query.order_by(desc(Post.published_at), desc(Post.created_at)).offset((page - 1) * page_size).limit(page_size).all()
    
    return PostListResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size
    )

@router.get("/posts/{slug}", response_model=PostResponse)
def get_public_post_by_slug(
    slug: str,
    db: Session = Depends(get_db),
):
    """Retrieves a published post by slug and increments its view counter."""
    post = db.query(Post).filter(Post.slug == slug, Post.status == "published").first()
    if not post:
        raise HTTPException(status_code=404, detail="Article not found")
        
    post.views += 1
    db.commit()
    db.refresh(post)
    return post

@router.get("/pages/{slug}", response_model=PageResponse)
def get_public_page_by_slug(
    slug: str,
    db: Session = Depends(get_db),
):
    """Retrieves a published page by slug."""
    page = db.query(Page).filter(Page.slug == slug, Page.is_published == True).first()
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return page

@router.get("/search")
def search_content(
    q: str = Query(..., min_length=2),
    db: Session = Depends(get_db),
):
    """Global search across published posts and pages."""
    term = f"%{q}%"
    posts = db.query(Post).filter(
        Post.status == "published",
        (Post.title.ilike(term) | Post.content.ilike(term) | Post.excerpt.ilike(term))
    ).limit(10).all()
    
    pages = db.query(Page).filter(
        Page.is_published == True,
        (Page.title.ilike(term) | Page.content.ilike(term))
    ).limit(5).all()

    return {
        "query": q,
        "posts": [PostResponse.model_validate(p) for p in posts],
        "pages": [PageResponse.model_validate(pg) for pg in pages],
    }
