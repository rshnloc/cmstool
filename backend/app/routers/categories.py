import re
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.entities import Category, Tag, Post, User
from app.schemas.pydantic_models import (
    CategoryCreate,
    CategoryResponse,
    TagCreate,
    TagResponse,
)

router = APIRouter(tags=["Taxonomy (Categories & Tags)"])

def slugify(text: str) -> str:
    slug = text.lower().strip()
    slug = re.sub(r"[^\w\s-]", "", slug)
    slug = re.sub(r"[\s_-]+", "-", slug)
    slug = re.sub(r"^-+|-+$", "", slug)
    return slug

# Categories
@router.get("/categories", response_model=List[CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    """Lists all categories along with their post counts."""
    categories = db.query(Category).all()
    result = []
    for cat in categories:
        count = db.query(func.count(Post.id)).filter(Post.category_id == cat.id).scalar()
        res = CategoryResponse.model_validate(cat)
        res.post_count = count or 0
        result.append(res)
    return result

@router.post("/categories", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    cat_in: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    slug = slugify(cat_in.slug or cat_in.name)
    existing = db.query(Category).filter((Category.name == cat_in.name) | (Category.slug == slug)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Category name or slug already exists")

    cat = Category(
        name=cat_in.name,
        slug=slug,
        description=cat_in.description,
        created_at=datetime.now(timezone.utc),
    )
    db.add(cat)
    db.commit()
    db.refresh(cat)
    res = CategoryResponse.model_validate(cat)
    res.post_count = 0
    return res

@router.delete("/categories/{cat_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    cat_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cat = db.query(Category).filter(Category.id == cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(cat)
    db.commit()
    return None

# Tags
@router.get("/tags", response_model=List[TagResponse])
def list_tags(db: Session = Depends(get_db)):
    return db.query(Tag).all()

@router.post("/tags", response_model=TagResponse, status_code=status.HTTP_201_CREATED)
def create_tag(
    tag_in: TagCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    slug = slugify(tag_in.slug or tag_in.name)
    existing = db.query(Tag).filter((Tag.name == tag_in.name) | (Tag.slug == slug)).first()
    if existing:
        return existing

    tag = Tag(name=tag_in.name, slug=slug)
    db.add(tag)
    db.commit()
    db.refresh(tag)
    return tag

@router.delete("/tags/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tag(
    tag_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    db.delete(tag)
    db.commit()
    return None
