import re
from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.entities import Post, Tag, Category, User
from app.schemas.pydantic_models import (
    PostCreate,
    PostUpdate,
    PostResponse,
    PostListResponse,
)

router = APIRouter(prefix="/posts", tags=["CMS Posts"])

def calculate_reading_time(text: str) -> int:
    words = len(re.findall(r"\w+", text or ""))
    return max(1, round(words / 200))

def slugify(text: str) -> str:
    slug = text.lower().strip()
    slug = re.sub(r"[^\w\s-]", "", slug)
    slug = re.sub(r"[\s_-]+", "-", slug)
    slug = re.sub(r"^-+|-+$", "", slug)
    return slug

@router.get("", response_model=PostListResponse)
def list_posts(
    status_filter: Optional[str] = Query(None, alias="status"),
    category_id: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Lists posts for CMS dashboard with filtering, search, and pagination."""
    query = db.query(Post)
    
    if status_filter:
        query = query.filter(Post.status == status_filter)
    if category_id:
        query = query.filter(Post.category_id == category_id)
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(Post.title.ilike(search_fmt) | Post.content.ilike(search_fmt))
        
    total = query.count()
    items = query.order_by(desc(Post.created_at)).offset((page - 1) * page_size).limit(page_size).all()
    
    return PostListResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size
    )

@router.post("", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
def create_post(
    post_in: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Creates a new post authored by the current user."""
    # Ensure slug
    slug = slugify(post_in.slug or post_in.title)
    if not slug:
        slug = f"post-{int(datetime.now(timezone.utc).timestamp())}"
        
    existing = db.query(Post).filter(Post.slug == slug).first()
    if existing:
        slug = f"{slug}-{int(datetime.now(timezone.utc).timestamp())}"
        
    # Associate tags
    tags = []
    if post_in.tag_ids:
        tags = db.query(Tag).filter(Tag.id.in_(post_in.tag_ids)).all()
        
    # Check category
    if post_in.category_id:
        cat = db.query(Category).filter(Category.id == post_in.category_id).first()
        if not cat:
            raise HTTPException(status_code=400, detail="Specified category does not exist")

    now = datetime.now(timezone.utc)
    reading_time = calculate_reading_time(post_in.content)
    
    post = Post(
        title=post_in.title,
        slug=slug,
        excerpt=post_in.excerpt,
        content=post_in.content,
        featured_image=post_in.featured_image,
        status=post_in.status,
        author_id=current_user.id,
        category_id=post_in.category_id,
        reading_time_minutes=reading_time,
        created_at=now,
        updated_at=now,
        published_at=now if post_in.status == "published" else None,
        tags=tags,
    )
    
    db.add(post)
    db.commit()
    db.refresh(post)
    return post

@router.get("/{post_id}", response_model=PostResponse)
def get_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieves post by ID."""
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.put("/{post_id}", response_model=PostResponse)
def update_post(
    post_id: int,
    post_in: PostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Updates an existing post."""
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
        
    data = post_in.model_dump(exclude_unset=True)
    
    if "title" in data and not data.get("slug") and not post.slug:
        data["slug"] = slugify(data["title"])
        
    if "slug" in data and data["slug"] != post.slug:
        data["slug"] = slugify(data["slug"])
        existing = db.query(Post).filter(Post.slug == data["slug"], Post.id != post_id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Slug already in use")
            
    if "content" in data:
        data["reading_time_minutes"] = calculate_reading_time(data["content"])
        
    if "status" in data:
        if data["status"] == "published" and post.status != "published":
            post.published_at = datetime.now(timezone.utc)
            
    if "tag_ids" in data:
        tag_ids = data.pop("tag_ids")
        if tag_ids is not None:
            post.tags = db.query(Tag).filter(Tag.id.in_(tag_ids)).all()

    for key, value in data.items():
        setattr(post, key, value)
        
    post.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(post)
    return post

@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Deletes a post."""
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
        
    db.delete(post)
    db.commit()
    return None
