import {
  AuthToken,
  User,
  Category,
  Tag,
  Post,
  PostListResponse,
  Page,
  Media,
  Setting,
  DashboardStats,
  SearchResults,
} from '../types';

const API_BASE = '/api';

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('cms_token');
  const headers = new Headers(options.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = 'An unexpected error occurred';
    try {
      const errorData = await response.json();
      errorMsg = errorData.detail || errorData.message || errorMsg;
    } catch {
      // Fallback
    }
    throw new ApiError(errorMsg, response.status);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  // Authentication
  auth: {
    login: (credentials: { username: string; password: string }) =>
      request<AuthToken>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    me: () => request<User>('/auth/me'),
  },

  // Posts
  posts: {
    list: (params?: { status?: string; category_id?: number; search?: string; page?: number; page_size?: number }) => {
      const q = new URLSearchParams();
      if (params?.status) q.append('status', params.status);
      if (params?.category_id) q.append('category_id', params.category_id.toString());
      if (params?.search) q.append('search', params.search);
      if (params?.page) q.append('page', params.page.toString());
      if (params?.page_size) q.append('page_size', params.page_size.toString());
      const qs = q.toString();
      return request<PostListResponse>(`/posts${qs ? `?${qs}` : ''}`);
    },
    get: (id: number) => request<Post>(`/posts/${id}`),
    create: (data: Partial<Post> & { tag_ids?: number[] }) =>
      request<Post>('/posts', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<Post> & { tag_ids?: number[] }) =>
      request<Post>(`/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      request<void>(`/posts/${id}`, {
        method: 'DELETE',
      }),
  },

  // Pages
  pages: {
    list: () => request<Page[]>('/pages'),
    get: (id: number) => request<Page>(`/pages/${id}`),
    create: (data: Partial<Page>) =>
      request<Page>('/pages', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<Page>) =>
      request<Page>(`/pages/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      request<void>(`/pages/${id}`, {
        method: 'DELETE',
      }),
  },

  // Categories & Tags
  categories: {
    list: () => request<Category[]>('/categories'),
    create: (data: { name: string; slug?: string; description?: string }) =>
      request<Category>('/categories', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      request<void>(`/categories/${id}`, {
        method: 'DELETE',
      }),
  },
  tags: {
    list: () => request<Tag[]>('/tags'),
    create: (data: { name: string; slug?: string }) =>
      request<Tag>('/tags', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      request<void>(`/tags/${id}`, {
        method: 'DELETE',
      }),
  },

  // Media
  media: {
    list: () => request<Media[]>('/media'),
    upload: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return request<Media>('/media/upload', {
        method: 'POST',
        body: formData,
      });
    },
    delete: (id: number) =>
      request<void>(`/media/${id}`, {
        method: 'DELETE',
      }),
  },

  // Settings
  settings: {
    list: () => request<Setting[]>('/settings'),
    updateBatch: (settingsDict: Record<string, string>) =>
      request<Setting[]>('/settings/batch', {
        method: 'POST',
        body: JSON.stringify(settingsDict),
      }),
  },

  // Public
  public: {
    getSettings: () => request<Record<string, string>>('/public/settings'),
    getCategories: () => request<Category[]>('/public/categories'),
    getPosts: (params?: { category_slug?: string; tag_slug?: string; search?: string; page?: number; page_size?: number }) => {
      const q = new URLSearchParams();
      if (params?.category_slug) q.append('category_slug', params.category_slug);
      if (params?.tag_slug) q.append('tag_slug', params.tag_slug);
      if (params?.search) q.append('search', params.search);
      if (params?.page) q.append('page', params.page.toString());
      if (params?.page_size) q.append('page_size', params.page_size.toString());
      const qs = q.toString();
      return request<PostListResponse>(`/public/posts${qs ? `?${qs}` : ''}`);
    },
    getPostBySlug: (slug: string) => request<Post>(`/public/posts/${slug}`),
    getPageBySlug: (slug: string) => request<Page>(`/public/pages/${slug}`),
    search: (query: string) => request<SearchResults>(`/public/search?q=${encodeURIComponent(query)}`),
  },

  // Analytics
  analytics: {
    getDashboard: () => request<DashboardStats>('/analytics/dashboard'),
  },
};
