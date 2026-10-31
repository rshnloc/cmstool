from datetime import datetime, timezone
from typing import List, Dict
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_admin_user, get_current_user
from app.models.entities import Setting, User
from app.schemas.pydantic_models import SettingResponse, SettingUpdate

router = APIRouter(prefix="/settings", tags=["CMS Settings"])

@router.get("", response_model=List[SettingResponse])
def get_all_settings(db: Session = Depends(get_db)):
    """Returns all settings."""
    return db.query(Setting).all()

@router.put("/{key}", response_model=SettingResponse)
def update_setting(
    key: str,
    setting_in: SettingUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user),
):
    """Updates a single setting key."""
    setting = db.query(Setting).filter(Setting.key == key).first()
    if not setting:
        setting = Setting(key=key, value=setting_in.value, updated_at=datetime.now(timezone.utc))
        db.add(setting)
    else:
        setting.value = setting_in.value
        setting.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(setting)
    return setting

@router.post("/batch", response_model=List[SettingResponse])
def batch_update_settings(
    settings_dict: Dict[str, str],
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user),
):
    """Updates multiple settings simultaneously."""
    results = []
    now = datetime.now(timezone.utc)
    for k, v in settings_dict.items():
        setting = db.query(Setting).filter(Setting.key == k).first()
        if not setting:
            setting = Setting(key=k, value=str(v), updated_at=now)
            db.add(setting)
        else:
            setting.value = str(v)
            setting.updated_at = now
        results.append(setting)

    db.commit()
    for s in results:
        db.refresh(s)
    return results
