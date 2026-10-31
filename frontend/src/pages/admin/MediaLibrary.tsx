import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Copy, Check, Image as ImageIcon } from 'lucide-react';
import { api } from '../../api/client';
import { Media } from '../../types';
import { AdminHeader } from '../../components/AdminHeader';

export const MediaLibrary: React.FC = () => {
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const loadMedia = () => {
    setLoading(true);
    api.media
      .list()
      .then(setMediaList)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const newMedia = await api.media.upload(file);
      setMediaList([newMedia, ...mediaList]);
    } catch (err: any) {
      alert(err.message || 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await api.media.delete(id);
      setMediaList(mediaList.filter((m) => m.id !== id));
    } catch (err: any) {
      alert(err.message || 'Error deleting file');
    }
  };

  const copyUrl = (id: number, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 min-h-screen">
      <AdminHeader
        title="Media Asset Library"
        subtitle="Upload and manage images and media for articles"
      />

      <main className="p-6 sm:p-8 space-y-6 flex-1">
        {/* Upload bar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-sm text-slate-900">Upload New Assets</h3>
            <p className="text-xs text-slate-500">Supports PNG, JPG, WEBP, SVG, and GIF</p>
          </div>

          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-all">
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Uploading...' : 'Choose File to Upload'}</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>

        {/* Gallery */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          {loading ? (
            <div className="py-20 text-center text-slate-400">Loading media...</div>
          ) : mediaList.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <ImageIcon className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No media assets found</p>
              <p className="text-xs text-slate-400">Upload your first image above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {mediaList.map((media) => (
                <div
                  key={media.id}
                  className="group rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all"
                >
                  <div className="aspect-video relative bg-slate-200 overflow-hidden">
                    <img
                      src={media.url}
                      alt={media.original_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>

                  <div className="p-3.5 space-y-2 bg-white">
                    <p className="text-xs font-bold text-slate-900 truncate" title={media.original_name}>
                      {media.original_name}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{formatBytes(media.file_size)}</span>
                      <span>{new Date(media.created_at).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <button
                        onClick={() => copyUrl(media.id, media.url)}
                        className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                      >
                        {copiedId === media.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy URL</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDelete(media.id, media.original_name)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Delete asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

