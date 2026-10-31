import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Mail, MapPin, Phone, Github, Shield } from 'lucide-react';
import { api } from '../api/client';

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    api.public.getSettings().then(setSettings).catch(() => {});
  }, []);

  const siteTitle = settings.site_title || 'Chronicle CMS';
  const siteTagline = settings.site_tagline || 'Modern Content Management System';
  const contactEmail = settings.contact_email || 'contact@example.org';
  const contactAddress = settings.contact_address || '100 Innovation Way, Suite 400, Tech City, TC 94016';
  const contactPhone = settings.contact_phone || '+1-555-0199';
  const copyright = settings.footer_copyright || '© 2026 Chronicle CMS Platform. All rights reserved.';

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white">
                <Layers className="w-4 h-4" />
              </div>
              <span className="font-bold text-white tracking-tight text-lg">{siteTitle}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {siteTagline}. Decoupled content management built with Python FastAPI and TypeScript.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                <Shield className="w-3 h-3 text-emerald-400" />
                Synthetic Test Environment
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">Explore</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/" className="hover:text-sky-400 transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to="/articles" className="hover:text-sky-400 transition-colors">All Articles</Link>
              </li>
              <li>
                <Link to="/page/about" className="hover:text-sky-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/page/privacy" className="hover:text-sky-400 transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Editorial & Admin */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">Administration</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/admin" className="hover:text-sky-400 transition-colors">CMS Studio Dashboard</Link>
              </li>
              <li>
                <Link to="/admin/posts/new" className="hover:text-sky-400 transition-colors">Write Article</Link>
              </li>
              <li>
                <a href="/docs" target="_blank" rel="noreferrer" className="hover:text-sky-400 transition-colors flex items-center gap-1">
                  <span>FastAPI Swagger Docs</span>
                  <span className="text-[10px] text-sky-400">↗</span>
                </a>
              </li>
              <li>
                <a href="/redoc" target="_blank" rel="noreferrer" className="hover:text-sky-400 transition-colors flex items-center gap-1">
                  <span>ReDoc OpenAPI</span>
                  <span className="text-[10px] text-sky-400">↗</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information (Purely Generic Mock Data) */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">Contact Desk</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                <span>{contactAddress}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{contactEmail}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{contactPhone}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>{copyright}</p>
          <p className="flex items-center gap-1">
            Engineered with <span className="text-sky-400 font-medium">FastAPI</span> & <span className="text-sky-400 font-medium">React TypeScript</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
