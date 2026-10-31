import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  Clock,
  Eye,
  BookOpen,
  Image,
  FolderTree,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { api } from '../../api/client';
import { DashboardStats } from '../../types';
import { AdminHeader } from '../../components/AdminHeader';

export const DashboardOverview: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.analytics
      .getDashboard()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
      <AdminHeader
        title="Dashboard Overview"
        subtitle="Real-time editorial and content analytics"
        actionText="Write New Article"
        actionTo="/admin/posts/new"
      />

      <main className="p-6 sm:p-8 space-y-8 flex-1">
        {loading || !stats ? (
          <div className="py-20 text-center text-slate-400">Loading metrics...</div>
        ) : (
          <>
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-semibold uppercase tracking-wider">Total Articles</span>
                  <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-slate-900">{stats.total_posts}</div>
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <span className="font-semibold text-emerald-600">{stats.published_posts} published</span>
                  <span>•</span>
                  <span>{stats.draft_posts} drafts</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-semibold uppercase tracking-wider">Total Readers</span>
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-slate-900">{stats.total_views}</div>
                <div className="text-xs text-indigo-600 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Aggregated article views</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-semibold uppercase tracking-wider">CMS Pages</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-slate-900">{stats.total_pages}</div>
                <div className="text-xs text-slate-400">Published landing & legal pages</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-semibold uppercase tracking-wider">Media Assets</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Image className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-slate-900">{stats.total_media}</div>
                <div className="text-xs text-slate-400">Stored images and files</div>
              </div>
            </div>

            {/* Quick Actions and Recent Posts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Articles */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">Recently Created Articles</h3>
                  <Link
                    to="/admin/posts"
                    className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="divide-y divide-slate-100">
                  {stats.recent_posts.map((post) => (
                    <div key={post.id} className="py-3.5 flex items-center justify-between">
                      <div className="space-y-1">
                        <Link
                          to={`/admin/posts/edit/${post.id}`}
                          className="font-semibold text-sm text-slate-900 hover:text-sky-600 transition-colors"
                        >
                          {post.title}
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                              post.status === 'published'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {post.status}
                          </span>
                          <span>•</span>
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <Link
                        to={`/admin/posts/edit/${post.id}`}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Edit
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fast Editorial Tools */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-sm">Quick Management</h3>
                <div className="space-y-2">
                  <Link
                    to="/admin/posts/new"
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 transition-all text-xs font-semibold text-slate-700"
                  >
                    <div className="flex items-center gap-2.5">
                      <Plus className="w-4 h-4 text-sky-600" />
                      <span>Draft New Article</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>

                  <Link
                    to="/admin/pages/new"
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 transition-all text-xs font-semibold text-slate-700"
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-amber-600" />
                      <span>Create New Page</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>

                  <Link
                    to="/admin/media"
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 transition-all text-xs font-semibold text-slate-700"
                  >
                    <div className="flex items-center gap-2.5">
                      <Image className="w-4 h-4 text-emerald-600" />
                      <span>Upload Media Asset</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>

                  <Link
                    to="/admin/categories"
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 transition-all text-xs font-semibold text-slate-700"
                  >
                    <div className="flex items-center gap-2.5">
                      <FolderTree className="w-4 h-4 text-indigo-600" />
                      <span>Manage Categories & Tags</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

