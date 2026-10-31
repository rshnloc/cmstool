import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Plus, ExternalLink, Edit3, Trash2 } from 'lucide-react';
import { api } from '../../api/client';
import { Page } from '../../types';
import { AdminHeader } from '../../components/AdminHeader';

export const PagesManager: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPages = () => {
    setLoading(true);
    api.pages
      .list()
      .then(setPages)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPages();
  }, []);

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`Delete page "${title}"?`)) return;
    try {
      await api.pages.delete(id);
      setPages(pages.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || 'Error deleting page');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
      <AdminHeader
        title="CMS Pages"
        subtitle="Manage static landing, legal, and company pages"
        actionText="Create Page"
        actionTo="/admin/pages/new"
      />

      <main className="p-6 sm:p-8 space-y-6 flex-1">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-slate-400">Loading pages...</div>
          ) : pages.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No pages created yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3 px-6">Page Title & Slug</th>
                    <th className="py-3 px-4">Template</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Last Updated</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {pages.map((page) => (
                    <tr key={page.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <Link
                          to={`/admin/pages/edit/${page.id}`}
                          className="font-bold text-slate-900 hover:text-sky-600 block text-sm"
                        >
                          {page.title}
                        </Link>
                        <span className="font-mono text-slate-400 text-[11px]">/page/{page.slug}</span>
                      </td>

                      <td className="py-4 px-4 capitalize text-slate-600">
                        {page.template}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            page.is_published
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {page.is_published ? 'Published' : 'Hidden'}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-slate-500">
                        {new Date(page.updated_at).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/page/${page.slug}`}
                            target="_blank"
                            title="View on site"
                            className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/admin/pages/edit/${page.id}`}
                            title="Edit page"
                            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(page.id, page.title)}
                            title="Delete page"
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

