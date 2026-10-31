export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: 'admin' | 'editor';
  is_active: boolean;
  created_at: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  user_id: number;
  username: string;
  role: string;
  full_name: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  post_count?: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  status: 'draft' | 'published' | 'archived';
  views: number;
  reading_time_minutes: number;
  author_id: number;
  category_id?: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
  category?: Category;
  tags?: Tag[];
  author?: User;
}

export interface PostListResponse {
  items: Post[];
  total: number;
  page: number;
  page_size: number;
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  template: 'standard' | 'landing' | 'contact';
  meta_description?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Media {
  id: number;
  filename: string;
  original_name: string;
  mime_type: string;
  file_size: number;
  url: string;
  created_at: string;
}

export interface Setting {
  id: number;
  key: string;
  value: string;
  description?: string;
  updated_at: string;
}

export interface DashboardStats {
  total_posts: number;
  published_posts: number;
  draft_posts: number;
  total_pages: number;
  total_categories: number;
  total_media: number;
  total_views: number;
  recent_posts: Post[];
}

export interface SearchResults {
  query: string;
  posts: Post[];
  pages: Page[];
}
