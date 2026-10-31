import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Plus,
  Search,
  ExternalLink,
  Edit3,
  Trash2,
  Clock,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { api } from '../../api/client';
import { Post } from '../../types';
import { AdminHeader } from '../../components/AdminHeader';

export const PostsManager: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const loadPosts = () => {
    setLoading(true);
    api.posts
      .list({
        status: statusFilter || undefined,
        search: searchTerm || undefined,
        page_size: 50,
      })
      .then((res) => setPosts(res.items))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPosts();
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadPosts();
  };

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.posts.delete(id);
      setPosts(posts.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || 'Error deleting post');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
      <AdminHeader
        title="Articles & Posts"
        subtitle="Manage and edit your publication's content"
        actionText="Write Article"
        actionTo="/admin/posts/new"
      />

      <main className="p-6 sm:p-8 space-y-6 flex-1">
        {/* Filters and search toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Status buttons */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
            {['', 'published', 'draft', 'archived'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {st || 'All Statuses'}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </form>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-slate-400">Loading articles...</div>
          ) : posts.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No articles match your filter</p>
              <Link
                to="/admin/posts/new"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 text-white rounded-lg text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Write New Article</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3 px-6">Title & Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Stats</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 max-w-md">
                        <Link
                          to={`/admin/posts/edit/${post.id}`}
                          className="font-bold text-slate-900 hover:text-sky-600 block line-clamp-1 text-sm"
                        >
                          {post.title}
                        </Link>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{post.category?.name || 'Uncategorized'}</span>
                          <span>•</span>
                          <span className="font-mono text-slate-400">/{post.slug}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${
                            post.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : post.status === 'draft'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {post.status}
                        </span>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap text-slate-500">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1" title="Views">
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            {post.views}
                          </span>
                          <span className="flex items-center gap-1" title="Reading time">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {post.reading_time_minutes}m
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap text-slate-500">
                        {new Date(post.created_at).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
                          {post.status === 'published' && (
                            <Link
                              to={`/articles/${post.slug}`}
                              target="_blank"
                              title="View on site"
                              className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          )}
                          <Link
                            to={`/admin/posts/edit/${post.id}`}
                            title="Edit article"
                            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id, post.title)}
                            title="Delete article"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

