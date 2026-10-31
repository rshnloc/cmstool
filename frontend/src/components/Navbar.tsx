import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Layers,
  Search,
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  BookOpen,
} from 'lucide-react';
import { api } from '../api/client';
import { Category } from '../types';

export const Navbar: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    api.public.getCategories().then(setCategories).catch(() => {});
    api.public.getSettings().then(setSiteSettings).catch(() => {});
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const siteTitle = siteSettings.site_title || 'Chronicle CMS';

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors">
                  {siteTitle}
                </span>
                <span className="hidden sm:inline-block ml-2 px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-sky-50 text-sky-700 border border-sky-200 rounded">
                  Demo
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/' ? 'text-sky-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Home
            </Link>
            <Link
              to="/articles"
              className={`text-sm font-medium transition-colors ${
                location.pathname.startsWith('/articles') ? 'text-sky-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Articles
            </Link>

            {/* Categories dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Categories
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 hidden group-hover:block animate-in fade-in slide-in-from-top-1 duration-150">
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/articles?category=${cat.slug}`}
                      className="flex items-center justify-between px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-sky-600"
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs bg-slate-100 text-slate-500 rounded-full px-2 py-0.5">
                        {cat.post_count || 0}
                      </span>
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-2 text-xs text-slate-400">No categories</div>
                )}
              </div>
            </div>

            <Link
              to="/page/about"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/page/about' ? 'text-sky-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              About
            </Link>
            <Link
              to="/page/contact"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/page/contact' ? 'text-sky-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right actions: Search + Admin portal button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Search articles"
            >
              <Search className="w-4 h-4" />
            </button>

            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 shadow-sm transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>CMS Admin</span>
            </Link>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search bar slide-down */}
        {searchOpen && (
          <div className="py-3 border-t border-slate-100 animate-in fade-in duration-150">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, guides, and pages..."
                className="w-full pl-10 pr-24 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 px-3 py-1 bg-sky-600 text-white rounded-lg text-xs font-medium hover:bg-sky-700 transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Home
            </Link>
            <Link
              to="/articles"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Articles
            </Link>
            <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Categories
            </div>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/articles?category=${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block pl-6 pr-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg"
              >
                {cat.name}
              </Link>
            ))}
            <Link
              to="/page/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              About
            </Link>
            <Link
              to="/page/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Contact
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
