import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Eye,
  Edit2,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../../api/client';
import { Category, Tag } from '../../types';
import { MarkdownRenderer } from '../../components/MarkdownRenderer';
import { MediaPickerModal } from '../../components/MediaPickerModal';

export const PostEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load categories and tags
    Promise.all([api.categories.list(), api.tags.list()])
      .then(([cats, tgs]) => {
        setCategories(cats);
        setTags(tgs);
      })
      .catch(console.error);

    // If editing, load post
    if (id) {
      api.posts
        .get(Number(id))
        .then((post) => {
          setTitle(post.title);
          setSlug(post.slug);
          setExcerpt(post.excerpt || '');
          setContent(post.content);
          setFeaturedImage(post.featured_image || '');
          setStatus(post.status);
          setCategoryId(post.category_id);
          setSelectedTagIds(post.tags?.map((t) => t.id) || []);
        })
        .catch((err) => setError(err.message || 'Error loading post'));
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
      alert('Please fill in title and content');
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      title,
      slug,
      excerpt,
      content,
      featured_image: featuredImage || undefined,
      status,
      category_id: categoryId,
      tag_ids: selectedTagIds,
    };

    try {
      if (isEditing) {
        await api.posts.update(Number(id), payload);
      } else {
        await api.posts.create(payload);
      }
      navigate('/admin/posts');
    } catch (err: any) {
      setError(err.message || 'Error saving post');
    } finally {
      setSaving(false);
    }
  };

  const toggleTag = (tagId: number) => {
    if (selectedTagIds.includes(tagId)) {
      setSelectedTagIds(selectedTagIds.filter((t) => t !== tagId));
    } else {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 min-h-screen">
      {/* Editor Header Bar */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/posts"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-slate-900">
              {isEditing ? 'Edit Article' : 'Draft New Article'}
            </h1>
            <p className="text-xs text-slate-400">
              {status === 'published' ? 'Published live' : 'Draft mode'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save & Update'}</span>
          </button>
        </div>
      </header>

      {/* Editor Body */}
      <main className="p-6 sm:p-8 flex-1 max-w-7xl mx-auto w-full">
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Writing Area (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <input
                type="text"
                placeholder="Article headline..."
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full text-2xl sm:text-3xl font-extrabold text-slate-900 placeholder:text-slate-300 focus:outline-none border-b border-transparent focus:border-slate-200 pb-2"
              />

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-mono text-slate-400">/articles/</span>
                <input
                  type="text"
                  placeholder="custom-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded px-2 py-0.5 text-xs font-mono text-slate-700 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Short Summary / Excerpt</label>
                <textarea
                  rows={2}
                  placeholder="Brief synopsis shown in article cards..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>
            </div>

            {/* Markdown Content Editor / Preview */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
              {/* Tabs */}
              <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('write')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      activeTab === 'write'
                        ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Markdown Editor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      activeTab === 'preview'
                        ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Live Preview</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setMediaPickerOpen(true)}
                  className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Insert Asset</span>
                </button>
              </div>

              {/* Editor Tab Content */}
              {activeTab === 'write' ? (
                <textarea
                  rows={18}
                  placeholder="Write your article in Markdown... (# Heading, **bold**, - list, ```code```)"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-6 text-sm font-mono text-slate-800 leading-relaxed focus:outline-none resize-y"
                />
              ) : (
                <div className="p-6 min-h-[400px]">
                  {content ? (
                    <MarkdownRenderer content={content} />
                  ) : (
                    <p className="text-slate-400 text-xs italic">Nothing to preview yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Properties (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Category selection */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <label className="text-xs font-bold text-slate-700 block">Primary Category</label>
              <select
                value={categoryId || ''}
                onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-sky-500"
              >
                <option value="">No Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Featured Image */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <label className="text-xs font-bold text-slate-700 block">Featured Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="/uploads/image.png or URL"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  className="flex-1 text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setMediaPickerOpen(true)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Browse
                </button>
              </div>
              {featuredImage && (
                <div className="rounded-xl overflow-hidden border border-slate-200 aspect-video mt-2">
                  <img src={featuredImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Tags selection */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <label className="text-xs font-bold text-slate-700 block">Taxonomy Tags</label>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => {
                  const isSelected = selectedTagIds.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleTag(t.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        isSelected
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      #{t.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => {
          if (!featuredImage) {
            setFeaturedImage(url);
          } else {
            setContent((prev) => `${prev}\n\n![Image](${url})\n\n`);
          }
        }}
      />
    </div>
  );
};

