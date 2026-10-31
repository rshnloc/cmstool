import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AdminSidebar } from './components/AdminSidebar';

// Public Website Pages
import { Home } from './pages/website/Home';
import { BlogIndex } from './pages/website/BlogIndex';
import { BlogPostDetail } from './pages/website/BlogPostDetail';
import { DynamicPage } from './pages/website/DynamicPage';
import { SearchResultsPage } from './pages/website/SearchResultsPage';

// Admin CMS Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { DashboardOverview } from './pages/admin/DashboardOverview';
import { PostsManager } from './pages/admin/PostsManager';
import { PostEditor } from './pages/admin/PostEditor';
import { PagesManager } from './pages/admin/PagesManager';
import { PageEditor } from './pages/admin/PageEditor';
import { MediaLibrary } from './pages/admin/MediaLibrary';
import { CategoriesManager } from './pages/admin/CategoriesManager';
import { SettingsManager } from './pages/admin/SettingsManager';

// Public layout wrapper
const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

// Admin protected layout wrapper
const ProtectedAdminLayout: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-400 text-sm">
        Authenticating session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Outlet />
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Website Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/articles" element={<BlogIndex />} />
        <Route path="/articles/:slug" element={<BlogPostDetail />} />
        <Route path="/page/:slug" element={<DynamicPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
      </Route>

      {/* Admin Login Route */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin CMS Studio Protected Routes */}
      <Route path="/admin" element={<ProtectedAdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardOverview />} />
        <Route path="posts" element={<PostsManager />} />
        <Route path="posts/new" element={<PostEditor />} />
        <Route path="posts/edit/:id" element={<PostEditor />} />
        <Route path="pages" element={<PagesManager />} />
        <Route path="pages/new" element={<PageEditor />} />
        <Route path="pages/edit/:id" element={<PageEditor />} />
        <Route path="media" element={<MediaLibrary />} />
        <Route path="categories" element={<CategoriesManager />} />
        <Route path="settings" element={<SettingsManager />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

