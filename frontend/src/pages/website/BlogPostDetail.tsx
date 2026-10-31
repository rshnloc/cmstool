import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Eye,
  Calendar,
  Share2,
  Tag as TagIcon,
} from 'lucide-react';
import { api } from '../../api/client';
import { Post } from '../../types';
import { MarkdownRenderer } from '../../components/MarkdownRenderer';

export const BlogPostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.public
      .getPostBySlug(slug)
      .then(setPost)
      .catch((err) => setError(err.message || 'Article not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center text-slate-400">
        Loading article...
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Article Not Found</h2>
        <p className="text-sm text-slate-500">The article you requested could not be located or has been archived.</p>
        <Link
          to="/articles"
          className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Top back link */}
      <div>
        <Link
          to="/articles"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-sky-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to all articles</span>
        </Link>
      </div>

      {/* Article Header */}
      <header className="space-y-6">
        <div className="flex items-center gap-3">
          {post.category && (
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-100">
              {post.category.name}
            </span>
          )}
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {post.reading_time_minutes} min read
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {post.views} reads
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-lg text-slate-600 leading-relaxed font-normal">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center">
              {post.author?.full_name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{post.author?.full_name || 'Staff Author'}</p>
              <p className="text-xs text-slate-400">
                Published {post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {post.featured_image && (
        <div className="rounded-2xl overflow-hidden border border-slate-200 aspect-video max-h-[460px]">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Content */}
      <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200/80 shadow-sm">
        <MarkdownRenderer content={post.content} />
      </div>

      {/* Tags footer */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex items-center gap-2 pt-6 border-t border-slate-200">
          <TagIcon className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500">Related Tags:</span>
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
