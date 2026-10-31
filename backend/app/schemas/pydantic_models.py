from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

# Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    username: str
    role: str
    full_name: str

class TokenData(BaseModel):
    user_id: Optional[int] = None
    username: Optional[str] = None
    role: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str

# User schemas
class UserBase(BaseModel):
    username: str
    email: str
    full_name: str
    role: str = "editor"
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Category schemas
class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime
    post_count: Optional[int] = 0

    class Config:
        from_attributes = True

# Tag schemas
class TagBase(BaseModel):
    name: str
    slug: str

class TagCreate(TagBase):
    pass

class TagResponse(TagBase):
    id: int

    class Config:
        from_attributes = True

# Post schemas
class PostBase(BaseModel):
    title: str
    slug: str
    excerpt: Optional[str] = None
    content: str
    featured_image: Optional[str] = None
    status: str = "draft"  # "draft", "published", "archived"
    category_id: Optional[int] = None
    reading_time_minutes: int = 3

class PostCreate(PostBase):
    tag_ids: List[int] = []

class PostUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    featured_image: Optional[str] = None
    status: Optional[str] = None
    category_id: Optional[int] = None
    reading_time_minutes: Optional[int] = None
    tag_ids: Optional[List[int]] = None

class PostResponse(BaseModel):
    id: int
    title: str
    slug: str
    excerpt: Optional[str]
    content: str
    featured_image: Optional[str]
    status: str
    views: int
    reading_time_minutes: int
    author_id: int
    category_id: Optional[int]
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime]
    category: Optional[CategoryResponse] = None
    tags: List[TagResponse] = []
    author: Optional[UserResponse] = None

    class Config:
        from_attributes = True

class PostListResponse(BaseModel):
    items: List[PostResponse]
    total: int
    page: int
    page_size: int

# Page schemas
class PageBase(BaseModel):
    title: str
    slug: str
    content: str
    template: str = "standard"  # "standard", "landing", "contact"
    meta_description: Optional[str] = None
    is_published: bool = True

class PageCreate(PageBase):
    pass

class PageUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    template: Optional[str] = None
    meta_description: Optional[str] = None
    is_published: Optional[bool] = None

class PageResponse(PageBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Media schemas
class MediaResponse(BaseModel):
    id: int
    filename: str
    original_name: str
    mime_type: str
    file_size: int
    url: str
    created_at: datetime

    class Config:
        from_attributes = True

# Setting schemas
class SettingBase(BaseModel):
    key: str
    value: str
    description: Optional[str] = None

class SettingUpdate(BaseModel):
    value: str

class SettingResponse(SettingBase):
    id: int
    updated_at: datetime

    class Config:
        from_attributes = True

# Dashboard analytics
class DashboardStats(BaseModel):
    total_posts: int
    published_posts: int
    draft_posts: int
    total_pages: int
    total_categories: int
    total_media: int
    total_views: int
    recent_posts: List[PostResponse]
