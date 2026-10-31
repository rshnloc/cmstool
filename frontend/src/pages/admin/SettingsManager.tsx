import React, { useState, useEffect } from 'react';
import { Sliders, Save, CheckCircle2, Shield } from 'lucide-react';
import { api } from '../../api/client';
import { AdminHeader } from '../../components/AdminHeader';

export const SettingsManager: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    api.settings
      .list()
      .then((items) => {
        const dict: Record<string, string> = {};
        items.forEach((s) => {
          dict[s.key] = s.value;
        });
        setSettings(dict);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.settings.updateBatch(settings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 min-h-screen">
      <AdminHeader
        title="Site Settings & Metadata"
        subtitle="Configure branding, public titles, and contact information"
      />

      <main className="p-6 sm:p-8 space-y-6 flex-1 max-w-4xl">
        {savedSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings successfully saved and synchronized!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* General Site Branding */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Brand & SEO Identity</h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Website Title</label>
                <input
                  type="text"
                  value={settings.site_title || ''}
                  onChange={(e) => handleChange('site_title', e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tagline</label>
                <input
                  type="text"
                  value={settings.site_tagline || ''}
                  onChange={(e) => handleChange('site_tagline', e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Site Description (Meta)</label>
                <textarea
                  rows={2}
                  value={settings.site_description || ''}
                  onChange={(e) => handleChange('site_description', e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Contact Details (Generic Mock Data) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Public Contact Information</h3>
              <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono">
                Mock Contact Channels
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Contact Email Address</label>
                <input
                  type="email"
                  value={settings.contact_email || ''}
                  onChange={(e) => handleChange('contact_email', e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Contact Office Address</label>
                <input
                  type="text"
                  value={settings.contact_address || ''}
                  onChange={(e) => handleChange('contact_address', e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Contact Telephone</label>
                <input
                  type="text"
                  value={settings.contact_phone || ''}
                  onChange={(e) => handleChange('contact_phone', e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Footer Copyright Text</label>
                <input
                  type="text"
                  value={settings.footer_copyright || ''}
                  onChange={(e) => handleChange('footer_copyright', e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Updating...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

