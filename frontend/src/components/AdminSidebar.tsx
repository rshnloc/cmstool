import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Image,
  FolderTree,
  Sliders,
  ExternalLink,
  LogOut,
  Layers,
  User as UserIcon,
  Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminSidebar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Overview', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Articles & Posts', to: '/admin/posts', icon: FileText },
    { label: 'CMS Pages', to: '/admin/pages', icon: BookOpen },
    { label: 'Media Library', to: '/admin/media', icon: Image },
    { label: 'Categories & Tags', to: '/admin/categories', icon: FolderTree },
    ...(isAdmin ? [{ label: 'Site Settings', to: '/admin/settings', icon: Sliders }] : []),
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
        <Link to="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white font-bold text-sm">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white text-sm tracking-tight">Chronicle</span>
            <span className="text-xs text-sky-400 block -mt-1 font-mono">Studio CMS</span>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 py-6 px-3 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider uppercase text-slate-500">
          Content Studio
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <div className="pt-6 px-3 pb-2 text-[11px] font-semibold tracking-wider uppercase text-slate-500">
          Shortcuts
        </div>
        <Link
          to="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <div className="flex items-center gap-3">
            <ExternalLink className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>View Live Site</span>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Tab</span>
        </Link>
      </div>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user?.full_name || user?.username || 'Editor'}</p>
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <Shield className="w-2.5 h-2.5 text-sky-400" />
                <span className="capitalize">{user?.role || 'editor'}</span>
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
