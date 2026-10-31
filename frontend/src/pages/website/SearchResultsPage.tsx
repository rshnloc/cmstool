import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ArrowRight, BookOpen, FileText } from 'lucide-react';
import { api } from '../../api/client';
import { SearchResults } from '../../types';

export const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      setLoading(true);
      api.public
        .search(query)
        .then(setResults)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [query]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Search Results for "{query}"
        </h1>
        <p className="text-xs text-slate-500">
          Found {results ? results.posts.length + results.pages.length : 0} matching items
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">Searching content...</div>
      ) : !results || (results.posts.length === 0 && results.pages.length === 0) ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-700">No matching results found</p>
          <p className="text-xs text-slate-400">Try searching with other keywords.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {results.posts.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-sky-600" />
                <span>Articles ({results.posts.length})</span>
              </h2>
              <div className="space-y-3">
                {results.posts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/articles/${post.slug}`}
                    className="block p-5 bg-white rounded-xl border border-slate-200 hover:border-sky-300 hover:shadow-sm transition-all"
                  >
                    <h3 className="font-bold text-slate-900 hover:text-sky-600 text-base mb-1">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.pages.length > 0 && (
            <div className="space-y-3 pt-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                <span>Pages ({results.pages.length})</span>
              </h2>
              <div className="space-y-3">
                {results.pages.map((page) => (
                  <Link
                    key={page.id}
                    to={`/page/${page.slug}`}
                    className="block p-5 bg-white rounded-xl border border-slate-200 hover:border-sky-300 hover:shadow-sm transition-all"
                  >
                    <h3 className="font-bold text-slate-900 hover:text-sky-600 text-base mb-1">
                      {page.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {page.meta_description || 'Click to view page'}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

