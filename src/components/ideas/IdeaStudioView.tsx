import React, { useState } from 'react';
import {
  Sparkles,
  Lightbulb,
  Plus,
  Search,
  Filter,
  Trash2,
  Copy,
  ArrowRight,
  ArrowLeft,
  Video,
  Layers,
  Flame,
  FileText,
  Loader2,
  RefreshCw,
  Bookmark,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateAIIdeas, generateMoreIdeasLikeThis } from '../../lib/aiActions';
import { Idea, ContentType } from '../../types';

export const IdeaStudioView: React.FC = () => {
  const {
    workspace,
    ideas,
    addIdea,
    deleteIdea,
    convertIdeaToContent,
    setCurrentView,
    lang,
  } = useApp();

  const isRtl = lang === 'fa';

  // AI Generator Form States
  const [topic, setTopic] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [goal, setGoal] = useState('افزایش تعامل و جذب لید');
  const [targetType, setTargetType] = useState<'all' | 'reel' | 'carousel' | 'story'>('all');
  const [category, setCategory] = useState('آموزشی');
  const [count, setCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBatch, setGeneratedBatch] = useState<any[]>([]);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPillar, setFilterPillar] = useState<string>('all');

  const categories = [
    'آموزشی (Educational)',
    'اعتمادسازی (Trust & Authority)',
    'فروش (Direct / Soft Sales)',
    'تعاملی (Engagement & Viral)',
    'برندینگ (Brand Storytelling)',
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedBatch([]);

    try {
      const results = await generateAIIdeas(workspace, {
        topic,
        productName: selectedProduct,
        goal,
        contentType: targetType,
        category,
        count,
      });
      setGeneratedBatch(results);
    } catch (err) {
      console.error('Idea generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveGeneratedIdea = async (item: any) => {
    await addIdea({
      title: item.title,
      description: item.description,
      contentType: item.contentType || 'reel',
      contentPillar: item.contentPillar || category,
      category: item.category || category,
      goal: item.goal || goal,
      status: 'ready',
    });
    // Remove from batch once saved
    setGeneratedBatch((prev) => prev.filter((i) => i.title !== item.title));
  };

  const handleSaveAllBatch = async () => {
    for (const item of generatedBatch) {
      await addIdea({
        title: item.title,
        description: item.description,
        contentType: item.contentType || 'reel',
        contentPillar: item.contentPillar || category,
        category: item.category || category,
        goal: item.goal || goal,
        status: 'ready',
      });
    }
    setGeneratedBatch([]);
  };

  const handleGenerateMoreLikeThis = async (baseIdea: Idea) => {
    setIsGenerating(true);
    try {
      const more = await generateMoreIdeasLikeThis(workspace, baseIdea);
      setGeneratedBatch(more);
      // scroll up
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error generating more:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Filtered Ideas List
  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch =
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || idea.contentType === filterType;
    const matchesPillar = filterPillar === 'all' || idea.contentPillar === filterPillar;
    return matchesSearch && matchesType && matchesPillar;
  });

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <span>{isRtl ? 'استودیوی ایده‌پردازی هوشمند' : 'AI Idea Studio'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isRtl
              ? 'تولید هوشمند ایده‌های متناسب با پرسونای مخاطب، لحن و محصولات برند شما'
              : 'Generate and catalog brand-aligned content ideas for Reels, Carousels, and Stories.'}
          </p>
        </div>
      </div>

      {/* 1. AI Idea Generator Box */}
      <div className="glass-panel rounded-2xl p-6 border-indigo-500/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">
              {isRtl ? 'ایده‌ساز بر اساس حافظه برند' : 'AI Idea Generator'}
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            {workspace?.products.length || 0} {isRtl ? 'محصول در دسترس برای ارجاع' : 'products in memory'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'موضوع یا چالش محتوایی (اختیاری یا آزاد)' : 'Topic or Content Angle'}
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={
                isRtl
                  ? 'مثال: ۵ اشتباه مهلک در سئو، راهکارهای افزایش تمرکز، معرفی محصول جدید...'
                  : 'e.g. 5 fatal mistakes, growth tips...'
              }
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'محصول یا خدمت هدف' : 'Target Product'}
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white outline-none"
            >
              <option value="">{isRtl ? 'همه محصولات / عمومی' : 'All / General Brand'}</option>
              {workspace?.products.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'دسته‌بندی (Pillar)' : 'Category'}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'نوع قالب محتوا' : 'Content Format'}
            </label>
            <select
              value={targetType}
              onChange={(e: any) => setTargetType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
            >
              <option value="all">{isRtl ? 'ترکیبی (Reel, Carousel, Story)' : 'All Formats'}</option>
              <option value="reel">Reel (ویدیو عمودی)</option>
              <option value="carousel">Carousel (اسلایدی)</option>
              <option value="story">Story (استوری)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'هدف اصلی ایده' : 'Primary Goal'}
            </label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="مثال: فروش مستقیم، سیو بالا..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'تعداد ایده‌ها' : 'Idea Count'}
            </label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
            >
              <option value={3}>۳ ایده</option>
              <option value={5}>۵ ایده (پیشنهادی)</option>
              <option value={10}>۱۰ ایده</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-amber-600 hover:from-indigo-500 hover:to-amber-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isRtl ? 'در حال خلق ایده‌ها...' : 'Generating Ideas...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isRtl ? 'تولید ایده‌های هوشمند' : 'Generate AI Ideas'}</span>
              </>
            )}
          </button>
        </div>

        {/* Generated Batch Preview */}
        {generatedBatch.length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">
                ✨ {generatedBatch.length} {isRtl ? 'ایده جدید تولید شد:' : 'new ideas generated:'}
              </span>
              <button
                onClick={handleSaveAllBatch}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isRtl ? 'ذخیره همه در کتابخانه' : 'Save all to Library'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {generatedBatch.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950 border border-indigo-500/40 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                        {item.contentType}
                      </span>
                      <span className="text-[10px] text-slate-400">{item.contentPillar}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white leading-snug">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-amber-400 font-medium">هدف: {item.goal}</span>
                    <button
                      onClick={() => handleSaveGeneratedIdea(item)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Bookmark className="w-3 h-3" />
                      <span>{isRtl ? 'ذخیره در آرشیو' : 'Save'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Idea Library & Archive */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">
              {isRtl ? 'کتابخانه ایده‌های ذخیره شده' : 'Saved Ideas Library'} ({filteredIdeas.length})
            </h3>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isRtl ? 'جستجو در ایده‌ها...' : 'Search ideas...'}
                className="bg-slate-900 border border-slate-800 rounded-lg pr-9 pl-3 py-1.5 text-xs text-white outline-none w-48"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 outline-none"
            >
              <option value="all">{isRtl ? 'همه قالب‌ها' : 'All formats'}</option>
              <option value="reel">Reel</option>
              <option value="carousel">Carousel</option>
              <option value="story">Story</option>
            </select>
          </div>
        </div>

        {/* Ideas Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredIdeas.length === 0 ? (
            <div className="col-span-3 py-12 text-center text-xs text-slate-500">
              {isRtl ? 'ایده‌ای با این مشخصات یافت نشد.' : 'No ideas found.'}
            </div>
          ) : (
            filteredIdeas.map((idea) => {
              const formatIcons = {
                reel: Video,
                carousel: Layers,
                story: Flame,
                scenario: FileText,
              };
              const Icon = formatIcons[idea.contentType] || FileText;

              return (
                <div
                  key={idea.id}
                  className="glass-card rounded-xl p-4 flex flex-col justify-between border-slate-800 hover:border-slate-700 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          {idea.contentType}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                        {idea.contentPillar}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
                      {idea.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-3 leading-relaxed">
                      {idea.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>هدف: {idea.goal || 'ارزش‌آفرینی'}</span>
                      <button
                        onClick={() => handleGenerateMoreLikeThis(idea)}
                        className="text-amber-400 hover:text-amber-300 flex items-center gap-0.5 cursor-pointer"
                        title="ایده‌های مشابه بساز"
                      >
                        <RefreshCw className="w-2.5 h-2.5" />
                        <span>مشابه این</span>
                      </button>
                    </div>

                    {/* Convert Button */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        onClick={() => convertIdeaToContent(idea)}
                        className="flex-1 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>{isRtl ? `تبدیل به ${idea.contentType}` : `Convert to ${idea.contentType}`}</span>
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteIdea(idea.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                        title="حذف ایده"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
