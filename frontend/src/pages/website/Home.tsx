import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Clock,
  Eye,
  BookOpen,
  Sparkles,
  Layers,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { api } from '../../api/client';
import { Post, Category } from '../../types';

export const Home: React.FC = () => {
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.public.getPosts({ page_size: 7 }),
      api.public.getCategories(),
      api.public.getSettings(),
    ])
      .then(([postsRes, catsRes, setsRes]) => {
        if (postsRes.items.length > 0) {
          setFeaturedPost(postsRes.items[0]);
          setLatestPosts(postsRes.items.slice(1));
        }
        setCategories(catsRes);
        setSettings(setsRes);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const siteTitle = settings.site_title || 'Chronicle CMS';
  const siteTagline = settings.site_tagline || 'High-Performance Content Management Platform';
  const siteDescription =
    settings.site_description ||
    'An open-architecture content platform engineered with Python FastAPI and TypeScript React.';

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 bg-gradient-to-b from-sky-50/60 via-slate-50 to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Python & TypeScript CMS Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              {siteTagline}
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
              {siteDescription}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/articles"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm shadow-md shadow-sky-600/20 transition-all hover:translate-y-[-1px]"
              >
                <span>Read Articles</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-300 shadow-sm transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                <span>Open CMS Admin Studio</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading publication feed...</div>
        ) : (
          <>
            {/* Featured Post Spotlight */}
            {featuredPost && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-sky-600" />
                    <span>Featured Spotlight</span>
                  </h2>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow overflow-hidden grid grid-cols-1 lg:grid-cols-12">
                  <div className="p-8 sm:p-12 lg:col-span-7 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        {featuredPost.category && (
                          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-100">
                            {featuredPost.category.name}
                          </span>
                        )}
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {featuredPost.reading_time_minutes} min read
                        </span>
                      </div>

                      <Link to={`/articles/${featuredPost.slug}`} className="block group">
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors leading-tight">
                          {featuredPost.title}
                        </h3>
                      </Link>

                      <p className="text-sm sm:text-base text-slate-600 leading-relaxed line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                          {featuredPost.author?.full_name?.charAt(0) || 'A'}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-900">
                            {featuredPost.author?.full_name || 'Editorial Staff'}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {featuredPost.published_at ? new Date(featuredPost.published_at).toLocaleDateString() : ''}
                          </p>
                        </div>
                      </div>

                      <Link
                        to={`/articles/${featuredPost.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700"
                      >
                        <span>Full Story</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-gradient-to-tr from-sky-900 to-indigo-950 p-8 sm:p-12 flex flex-col justify-center text-white relative overflow-hidden">
                    <div className="relative z-10 space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <BookOpen className="w-6 h-6 text-sky-300" />
                      </div>
                      <h4 className="text-xl font-bold tracking-tight">Decoupled Architecture</h4>
                      <p className="text-xs text-sky-200/90 leading-relaxed">
                        Articles are dynamically authored in the Chronicle Studio, validated via Pydantic schemas, and served via instant REST endpoints.
                      </p>
                      <div className="pt-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-300">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{featuredPost.views} total reads</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Categories Shelf */}
            <section className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Explore Thematic Topics
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/articles?category=${cat.slug}`}
                    className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-sky-50 text-slate-600 group-hover:text-sky-600 flex items-center justify-center mb-3 transition-colors">
                      <Layers className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-sky-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {cat.post_count || 0} published articles
                    </p>
                  </Link>
                ))}
              </div>
            </section>

            {/* Latest Articles Grid */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Latest Articles</h2>
                  <p className="text-xs text-slate-500">Fresh technical writing, guides, and architectural overviews</p>
                </div>
                <Link
                  to="/articles"
                  className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestPosts.map((post) => (
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
                        ) : (
                          <span />
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.reading_time_minutes}m
                        </span>
                      </div>

                      <Link to={`/articles/${post.slug}`}>
                        <h3 className="font-bold text-base text-slate-900 group-hover:text-sky-600 transition-colors leading-snug">
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
            </section>
          </>
        )}
      </main>
    </div>
  );
};
