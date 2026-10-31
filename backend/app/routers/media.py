import os
import shutil
import uuid
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.core.config import settings
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.entities import Media, User
from app.schemas.pydantic_models import MediaResponse

router = APIRouter(prefix="/media", tags=["Media Manager"])

# Allowed extensions
ALLOWED_EXTENSIONS = {
    "png", "jpg", "jpeg", "gif", "webp", "svg", "pdf", "mp4"
}

@router.get("", response_model=List[MediaResponse])
def list_media(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Lists all uploaded media assets."""
    return db.query(Media).order_by(desc(Media.created_at)).all()

@router.post("/upload", response_model=MediaResponse, status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Uploads an image or document, saves to uploads directory, and registers in DB."""
    # Ensure upload directory exists
    settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    
    filename = file.filename or "unnamed_file"
    ext = filename.split(".")[-1].lower() if "." in filename else ""
    
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File extension '.{ext}' is not permitted. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # Generate safe unique filename
    unique_filename = f"{uuid.uuid4().hex[:12]}_{filename.replace(' ', '_')}"
    file_path = settings.UPLOAD_DIR / unique_filename

    # Read and save file content
    contents = await file.read()
    file_size = len(contents)
    
    with open(file_path, "wb") as f:
        f.write(contents)

    media = Media(
        filename=unique_filename,
        original_name=filename,
        mime_type=file.content_type or "application/octet-stream",
        file_size=file_size,
        url=f"/uploads/{unique_filename}",
        created_at=datetime.now(timezone.utc),
    )
    
    db.add(media)
    db.commit()
    db.refresh(media)
    return media

@router.delete("/{media_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_media(
    media_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Removes a media file from disk and database."""
    media = db.query(Media).filter(Media.id == media_id).first()
    if not media:
        raise HTTPException(status_code=404, detail="Media asset not found")

    file_path = settings.UPLOAD_DIR / media.filename
    if file_path.exists():
        try:
            file_path.unlink()
        except OSError:
            pass

    db.delete(media)
    db.commit()
    return None
