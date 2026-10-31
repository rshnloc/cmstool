import re
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.entities import Page, User
from app.schemas.pydantic_models import PageCreate, PageUpdate, PageResponse

router = APIRouter(prefix="/pages", tags=["CMS Pages"])

def slugify(text: str) -> str:
    slug = text.lower().strip()
    slug = re.sub(r"[^\w\s-]", "", slug)
    slug = re.sub(r"[\s_-]+", "-", slug)
    slug = re.sub(r"^-+|-+$", "", slug)
    return slug

@router.get("", response_model=List[PageResponse])
def list_pages(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Lists all CMS pages."""
    return db.query(Page).order_by(desc(Page.created_at)).all()

@router.post("", response_model=PageResponse, status_code=status.HTTP_201_CREATED)
def create_page(
    page_in: PageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Creates a new CMS page."""
    slug = slugify(page_in.slug or page_in.title)
    existing = db.query(Page).filter(Page.slug == slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="A page with this slug already exists")

    page = Page(
        title=page_in.title,
        slug=slug,
        content=page_in.content,
        template=page_in.template,
        meta_description=page_in.meta_description,
        is_published=page_in.is_published,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(page)
    db.commit()
    db.refresh(page)
    return page

@router.get("/{page_id}", response_model=PageResponse)
def get_page(
    page_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    page = db.query(Page).filter(Page.id == page_id).first()
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return page

@router.put("/{page_id}", response_model=PageResponse)
def update_page(
    page_id: int,
    page_in: PageUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    page = db.query(Page).filter(Page.id == page_id).first()
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")

    data = page_in.model_dump(exclude_unset=True)
    if "slug" in data and data["slug"] != page.slug:
        data["slug"] = slugify(data["slug"])
        existing = db.query(Page).filter(Page.slug == data["slug"], Page.id != page_id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Slug already in use")

    for key, value in data.items():
        setattr(page, key, value)

    page.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(page)
    return page

@router.delete("/{page_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_page(
    page_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    page = db.query(Page).filter(Page.id == page_id).first()
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    db.delete(page)
    db.commit()
    return None
