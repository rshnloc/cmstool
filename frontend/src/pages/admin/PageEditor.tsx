import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Edit2, Eye } from 'lucide-react';
import { api } from '../../api/client';
import { MarkdownRenderer } from '../../components/MarkdownRenderer';

export const PageEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [template, setTemplate] = useState<'standard' | 'landing' | 'contact'>('standard');
  const [metaDescription, setMetaDescription] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      api.pages
        .get(Number(id))
        .then((page) => {
          setTitle(page.title);
          setSlug(page.slug);
          setContent(page.content);
          setTemplate(page.template);
          setMetaDescription(page.meta_description || '');
          setIsPublished(page.is_published);
        })
        .catch((err) => setError(err.message || 'Error loading page'));
    }
  }, [id]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing && !slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '')
      );
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Title and content are required');
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      title,
      slug,
      content,
      template,
      meta_description: metaDescription,
      is_published: isPublished,
    };

    try {
      if (isEditing) {
        await api.pages.update(Number(id), payload);
      } else {
        await api.pages.create(payload);
      }
      navigate('/admin/pages');
    } catch (err: any) {
      setError(err.message || 'Error saving page');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 min-h-screen">
      <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/pages"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-base font-bold text-slate-900">
            {isEditing ? 'Edit Page' : 'Create New Page'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="rounded text-sky-600 focus:ring-sky-500"
            />
            <span>Published</span>
          </label>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Page'}</span>
          </button>
        </div>
      </header>

      <main className="p-6 sm:p-8 flex-1 max-w-5xl mx-auto w-full space-y-6">
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
            {error}
          </div>
        )}

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <input
            type="text"
            placeholder="Page title..."
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full text-2xl font-extrabold text-slate-900 placeholder:text-slate-300 focus:outline-none border-b border-transparent focus:border-slate-200 pb-2"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-mono text-slate-400">/page/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="slug"
                className="flex-1 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-mono"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-bold text-slate-600">Template:</span>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-semibold"
              >
                <option value="standard">Standard Document</option>
                <option value="landing">Marketing Landing</option>
                <option value="contact">Contact Information</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 mb-1 block">Meta Description (SEO)</label>
            <input
              type="text"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Summary for search engines..."
              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
            />
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'write' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500'
              }`}
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Markdown</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'preview' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>

          {activeTab === 'write' ? (
            <textarea
              rows={16}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write page content in Markdown format..."
              className="w-full p-6 text-sm font-mono text-slate-800 leading-relaxed focus:outline-none"
            />
          ) : (
            <div className="p-6 min-h-[350px]">
              {content ? <MarkdownRenderer content={content} /> : <p className="text-xs text-slate-400 italic">No content written yet.</p>}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

