import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Clock, ArrowRight, Filter, BookOpen } from 'lucide-react';
import { api } from '../../api/client';
import { Post, Category } from '../../types';

export const BlogIndex: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || '';
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.public.getPosts({ category_slug: activeCategory || undefined }),
      api.public.getCategories(),
    ])
      .then(([postsRes, catsRes]) => {
        setPosts(postsRes.items);
        setCategories(catsRes);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Knowledge Hub</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Articles & Publications
        </h1>
        <p className="text-sm text-slate-600 max-w-xl">
          Browse published architectural articles, editorial notes, and software engineering guides.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-b border-slate-200 pb-4">
        <button
          onClick={() => setSearchParams({})}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            !activeCategory
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          All Topics
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSearchParams({ category: cat.slug })}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeCategory === cat.slug
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {cat.name} ({cat.post_count || 0})
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="text-center py-24 text-slate-400">Loading articles...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <p className="text-base font-semibold text-slate-700">No articles found</p>
          <p className="text-xs text-slate-500">Try choosing a different topic or resetting filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  {post.category ? (
                    <span className="font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded text-[11px]">
                      {post.category.name}
                    </span>
                  ) : <span />}
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.reading_time_minutes} min read
                  </span>
                </div>

                <Link to={`/articles/${post.slug}`}>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-sky-600 transition-colors leading-snug">
                    {post.title}
                  </h3>
                </Link>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Recent'}
                </span>
                <Link
                  to={`/articles/${post.slug}`}
                  className="font-semibold text-slate-900 group-hover:text-sky-600 flex items-center gap-1 transition-colors"
                >
                  Read
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
