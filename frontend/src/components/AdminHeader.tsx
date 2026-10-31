import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  actionTo?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
  actionText,
  actionTo,
}) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h1 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {actionText && actionTo && (
          <Link
            to={actionTo}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all shadow-sky-600/10"
          >
            <Plus className="w-4 h-4" />
            <span>{actionText}</span>
          </Link>
        )}
      </div>
    </header>
  );
};
