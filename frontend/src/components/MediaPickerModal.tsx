import React, { useState, useEffect } from 'react';
import { X, Upload, Check, Image as ImageIcon } from 'lucide-react';
import { api } from '../api/client';
import { Media } from '../types';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen]);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const data = await api.media.list();
      setMediaList(data);
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const newMedia = await api.media.upload(file);
      setMediaList([newMedia, ...mediaList]);
      setSelectedUrl(newMedia.url);
    } catch (err: any) {
      alert(err.message || 'Error uploading media file');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Media Asset Library</h3>
            <p className="text-xs text-slate-500">Select an existing image or upload a new asset</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload banner */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all">
            <Upload className="w-3.5 h-3.5" />
            <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
          <span className="text-[11px] text-slate-400">Supported: PNG, JPG, WEBP, GIF, SVG</span>
        </div>

        {/* Gallery */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
              Loading media library...
            </div>
          ) : mediaList.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <ImageIcon className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-600">No media assets found</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Upload your first image above to use it across articles and pages.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {mediaList.map((media) => {
                const isSelected = selectedUrl === media.url;
                return (
                  <button
                    key={media.id}
                    type="button"
                    onClick={() => setSelectedUrl(media.url)}
                    className={`group relative rounded-xl border-2 overflow-hidden aspect-video text-left transition-all ${
                      isSelected
                        ? 'border-sky-600 ring-2 ring-sky-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={media.url}
                      alt={media.original_name}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 bg-sky-600 text-white rounded-full p-0.5 shadow">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                      <p className="text-[10px] text-white truncate font-medium">{media.original_name}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selectedUrl}
            onClick={() => {
              if (selectedUrl) {
                onSelect(selectedUrl);
                onClose();
              }
            }}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            Insert Asset
          </button>
        </div>
      </div>
    </div>
  );
};
