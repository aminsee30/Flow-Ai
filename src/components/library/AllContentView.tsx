import React, { useState } from 'react';
import {
  FolderOpen,
  Search,
  Filter,
  Video,
  Layers,
  Flame,
  FileText,
  Copy,
  Trash2,
  Calendar,
  Clock,
  ArrowLeft,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ContentItem } from '../../types';

export const AllContentView: React.FC = () => {
  const {
    contents,
    deleteContent,
    duplicateContent,
    setActiveContentId,
    setCurrentView,
    lang,
  } = useApp();

  const isRtl = lang === 'fa';

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = contents.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.caption?.toLowerCase().includes(search.toLowerCase()) ||
      item.hook?.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === 'all' || item.contentType === typeFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const openContent = (item: ContentItem) => {
    setActiveContentId(item.id);
    if (item.contentType === 'reel') setCurrentView('reel-studio');
    else if (item.contentType === 'carousel') setCurrentView('carousel-studio');
    else if (item.contentType === 'story') setCurrentView('story-studio');
    else setCurrentView('scenario-studio');
  };

  const getFormatIcon = (type: string) => {
    switch (type) {
      case 'reel':
        return <Video className="w-4 h-4 text-rose-400" />;
      case 'carousel':
        return <Layers className="w-4 h-4 text-indigo-400" />;
      case 'story':
        return <Flame className="w-4 h-4 text-orange-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-indigo-400" />
            <span>{isRtl ? 'آرشیو مرکزی تمام محتواها (Content Library)' : 'Content Library'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isRtl
              ? 'مشاهده، فیلتر، تکثیر و مدیریت تمام ریلزها، کاروسل‌ها و استوری‌های ساخته‌شده'
              : 'Unified archive for all scenarios, reels, carousels, and story sequences.'}
          </p>
        </div>

        <button
          onClick={() => setCurrentView('ideas')}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isRtl ? 'تولید محتوای جدید' : 'New Content'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-2xl p-4 border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isRtl ? 'جستجو بر اساس عنوان، کپشن، کلمات کلیدی...' : 'Search content...'}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-4 py-2 text-xs text-white outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none"
          >
            <option value="all">{isRtl ? 'تمام قالب‌ها' : 'All formats'}</option>
            <option value="reel">Reel</option>
            <option value="carousel">Carousel</option>
            <option value="story">Story</option>
            <option value="scenario">Scenario</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none"
          >
            <option value="all">{isRtl ? 'تمام وضعیت‌ها' : 'All statuses'}</option>
            <option value="draft">پیش‌نویس (Draft)</option>
            <option value="in_progress">در حال تولید (In Progress)</option>
            <option value="ready">آماده (Ready)</option>
            <option value="scheduled">زمان‌بندی‌شده (Scheduled)</option>
            <option value="published">منتشر شده (Published)</option>
          </select>
        </div>
      </div>

      {/* Grid of Content Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-3 py-16 text-center text-xs text-slate-500">
            {isRtl ? 'محتوایی با فیلترهای انتخابی یافت نشد.' : 'No content items found.'}
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-2xl p-5 border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    {getFormatIcon(item.contentType)}
                    <span className="text-[10px] font-bold uppercase text-slate-300">
                      {item.contentType}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.status === 'published'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : item.status === 'scheduled'
                        ? 'bg-purple-500/20 text-purple-400'
                        : item.status === 'ready'
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h3
                  onClick={() => openContent(item)}
                  className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors cursor-pointer leading-snug"
                >
                  {item.title}
                </h3>

                {item.hook && (
                  <p className="text-[11px] text-amber-300/80 mt-1.5 italic line-clamp-2">
                    «{item.hook}»
                  </p>
                )}

                {item.scheduledDate && (
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-2 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>
                      {item.scheduledDate} • {item.scheduledTime || '19:30'}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => openContent(item)}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>{isRtl ? 'ویرایش و باز کردن' : 'Open in Studio'}</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => duplicateContent(item.id)}
                    className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                    title="تکثیر و ساخت نسخه کپی (Duplicate)"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteContent(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
