import React, { useState, useEffect } from 'react';
import { FolderTree, Tag, Plus, Trash2 } from 'lucide-react';
import { api } from '../../api/client';
import { Category, Tag as TagType } from '../../types';
import { AdminHeader } from '../../components/AdminHeader';

export const CategoriesManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newTagName, setNewTagName] = useState('');

  const loadData = () => {
    Promise.all([api.categories.list(), api.tags.list()])
      .then(([cats, tgs]) => {
        setCategories(cats);
        setTags(tgs);
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await api.categories.create({ name: newCatName.trim(), description: newCatDesc.trim() || undefined });
      setNewCatName('');
      setNewCatDesc('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error creating category');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm('Delete category? Posts in this category will become uncategorized.')) return;
    try {
      await api.categories.delete(id);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error deleting category');
    }
  };

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    try {
      await api.tags.create({ name: newTagName.trim() });
      setNewTagName('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error creating tag');
    }
  };

  const handleDeleteTag = async (id: number) => {
    try {
      await api.tags.delete(id);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error deleting tag');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 min-h-screen">
      <AdminHeader
        title="Taxonomy Management"
        subtitle="Organize articles with categories and cross-cutting tags"
      />

      <main className="p-6 sm:p-8 space-y-8 flex-1 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Categories Section */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-sky-600" />
                <span>Create Category</span>
              </h3>

              <form onSubmit={handleAddCategory} className="space-y-3">
                <input
                  type="text"
                  placeholder="Category Name (e.g. Engineering)"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500"
                />
                <textarea
                  rows={2}
                  placeholder="Optional description..."
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 font-bold text-xs text-slate-700">
                Active Categories ({categories.length})
              </div>
              <div className="divide-y divide-slate-100">
                {categories.map((c) => (
                  <div key={c.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                    <div>
                      <p className="font-bold text-xs text-slate-900">{c.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">/{c.slug} • {c.post_count || 0} posts</p>
                      {c.description && <p className="text-xs text-slate-500 mt-1">{c.description}</p>}
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(c.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-600" />
                <span>Create Tag</span>
              </h3>

              <form onSubmit={handleAddTag} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Tag label (e.g. python)"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                >
                  Add
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="font-bold text-xs text-slate-700">
                Active Tags ({tags.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span
                    key={t.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"
                  >
                    <span>#{t.name}</span>
                    <button
                      onClick={() => handleDeleteTag(t.id)}
                      className="text-slate-400 hover:text-rose-500 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

