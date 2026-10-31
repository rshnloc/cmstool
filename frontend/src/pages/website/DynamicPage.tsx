import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Mail, MapPin, Phone } from 'lucide-react';
import { api } from '../../api/client';
import { Page } from '../../types';
import { MarkdownRenderer } from '../../components/MarkdownRenderer';

export const DynamicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.public
      .getPageBySlug(slug)
      .then(setPage)
      .catch((err) => setError(err.message || 'Page not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="max-w-4xl mx-auto py-24 text-center text-slate-400">Loading page...</div>;
  }

  if (error || !page) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Page Not Found</h2>
        <p className="text-sm text-slate-500">The requested page does not exist or has been unpublished.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-sky-600 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      <header className="space-y-3 pb-6 border-b border-slate-200">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {page.title}
        </h1>
        {page.meta_description && (
          <p className="text-base text-slate-600">{page.meta_description}</p>
        )}
      </header>

      <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200/80 shadow-sm">
        <MarkdownRenderer content={page.content} />
      </div>
    </div>
  );
};
