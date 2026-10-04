import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Copy,
  Check,
  Save,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateAICarouselSlides } from '../../lib/aiActions';
import { CarouselSlide } from '../../types';

export const CarouselStudioView: React.FC = () => {
  const {
    workspace,
    activeContent,
    updateContent,
    lang,
  } = useApp();

  const isRtl = lang === 'fa';

  const [title, setTitle] = useState(activeContent?.title || 'کاروسل آموزشی ورق‌زدنی');
  const [slideCount, setSlideCount] = useState<number>(5);
  const [scrollStopHooks, setScrollStopHooks] = useState<string[]>([
    activeContent?.title || 'چرا پیج شما نمی‌فروشد؟',
  ]);
  const [slides, setSlides] = useState<CarouselSlide[]>(
    activeContent?.carouselSlides || [
      {
        slideNumber: 1,
        type: 'hook',
        title: activeContent?.title || 'عنوان فوق‌العاده جذاب و قلاب‌دار',
        body: 'اگر با وجود تلاش زیاد نتیجه نمی‌گیرید، این ۵ نکته را ورق بزنید.',
        visualSuggestion: 'پس‌زمینه تیره با تایپوگرافی زرد بسیار درشت و کنتراست شدید',
      },
      {
        slideNumber: 2,
        type: 'context',
        title: 'ریشه اصلی مشکل کجاست؟',
        body: 'اکثر افراد تصور می‌کنند الگوریتم با آنها لج کرده، اما مشکل در نبود پیام شفاف است.',
        visualSuggestion: 'تصویر مقایسه یا نمودار نزولی ساده',
      },
      {
        slideNumber: 3,
        type: 'content',
        title: 'گام ۱: ساده‌سازی فرایند',
        body: 'مشتری را درگیر مراحل پیچیده نکنید. مسیر خرید باید حداکثر در ۲ کلیک تمام شود.',
        visualSuggestion: 'باکس شماره‌دار تمیز همراه با آیکون تیک سبز',
      },
      {
        slideNumber: 4,
        type: 'content',
        title: 'گام ۲: اثبات اجتماعی ملموس',
        body: 'قبل از معرفی قیمت، نتایج و رضایت خریداران قبلی را شفاف نشان دهید.',
        visualSuggestion: 'قاب اسکرین‌شات چت مشتری',
      },
      {
        slideNumber: 5,
        type: 'cta',
        title: 'سیو کن تا در سناریوی بعدیت اجرا کنی!',
        body: 'برای دریافت چک‌لیست رایگان، کلمه «رشد» را در دایرکت ارسال کنید.',
        visualSuggestion: 'تصویر آیکون ذخیره و فلش دعوت به پیام دایرکت',
      },
    ]
  );

  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (activeContent?.carouselSlides && activeContent.carouselSlides.length > 0) {
      setSlides(activeContent.carouselSlides);
      setSlideCount(activeContent.carouselSlides.length);
    }
  }, [activeContent?.id]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await generateAICarouselSlides(workspace, {
        title,
        description: activeContent?.scenarioText || title,
        slideCount,
      });

      setScrollStopHooks(res.scrollStopHooks);
      setSlides(res.slides);
      setActivePreviewIndex(0);

      if (activeContent) {
        await updateContent(activeContent.id, {
          carouselSlides: res.slides,
          hook: res.slides[0]?.title || activeContent.hook,
        });
      }
    } catch (err) {
      console.error('Carousel generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (activeContent) {
      await updateContent(activeContent.id, {
        title,
        carouselSlides: slides,
        hook: slides[0]?.title || activeContent.hook,
        contentType: 'carousel',
      });
    }
  };

  // Slide CRUD & Reorder
  const addSlide = () => {
    const newSlide: CarouselSlide = {
      slideNumber: slides.length + 1,
      type: 'content',
      title: `اسلاید ${slides.length + 1}`,
      body: 'متن توضیحات این اسلاید را وارد کنید...',
      visualSuggestion: 'پیشنهاد چیدمان و عناصر گرافیکی',
    };
    setSlides([...slides, newSlide]);
  };

  const deleteSlide = (index: number) => {
    if (slides.length <= 2) return; // Keep at least 2
    const updated = slides
      .filter((_, i) => i !== index)
      .map((s, idx) => ({ ...s, slideNumber: idx + 1 }));
    setSlides(updated);
    if (activePreviewIndex >= updated.length) {
      setActivePreviewIndex(updated.length - 1);
    }
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= slides.length) return;

    const copy = [...slides];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;

    // re-index
    const reindexed = copy.map((s, idx) => ({ ...s, slideNumber: idx + 1 }));
    setSlides(reindexed);
    setActivePreviewIndex(targetIdx);
  };

  const copyAllSlides = () => {
    const text = slides
      .map(
        (s) => `[Slide ${s.slideNumber} - ${s.type.toUpperCase()}]
${s.title}
${s.body}
(طراحی: ${s.visualSuggestion})`
      )
      .join('\n\n---\n\n');

    navigator.clipboard.writeText(text);
    setCopiedKey('all');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const copyHeadlinesOnly = () => {
    const text = slides.map((s) => `${s.slideNumber}. ${s.title}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedKey('headlines');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const currentPreviewSlide = slides[activePreviewIndex] || slides[0];

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-base sm:text-lg font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-indigo-500 outline-none px-1 w-full"
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isRtl
              ? 'تولید ساختار اسلاید به اسلاید کاروسل اینستاگرام همراه با دایرکشن گرافیکی و پیش‌نمایش زنده'
              : 'Slide-by-slide copy & visual art direction with responsive interactive preview.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={copyAllSlides}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            {copiedKey === 'all' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isRtl ? 'کپی کل اسلایدها' : 'Copy All Slides'}</span>
          </button>

          <button
            onClick={copyHeadlinesOnly}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            {copiedKey === 'headlines' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isRtl ? 'کپی فقط تیترها' : 'Headlines Only'}</span>
          </button>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isRtl ? 'در حال تولید اسلایدها...' : 'Generating...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isRtl ? 'تولید کاروسل با هوش مصنوعی' : 'Generate with AI'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isRtl ? 'ذخیره' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Slide Editor & Right Live Slide Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Slides Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">
                {isRtl ? 'اسلایدهای محتوا' : 'Carousel Slides'} ({slides.length})
              </span>
            </div>

            <button
              onClick={addSlide}
              className="px-3 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isRtl ? 'افزودن اسلاید جدید' : 'Add Slide'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {slides.map((slide, idx) => (
              <div
                key={slide.slideNumber || idx}
                onClick={() => setActivePreviewIndex(idx)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                  activePreviewIndex === idx
                    ? 'bg-slate-900 border-indigo-500 shadow-md shadow-indigo-500/10'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center text-xs font-bold">
                      {slide.slideNumber}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                      {slide.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveSlide(idx, 'up');
                      }}
                      disabled={idx === 0}
                      className="p-1 text-slate-500 hover:text-white disabled:opacity-30"
                      title="حرکت به بالا"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveSlide(idx, 'down');
                      }}
                      disabled={idx === slides.length - 1}
                      className="p-1 text-slate-500 hover:text-white disabled:opacity-30"
                      title="حرکت به پایین"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSlide(idx);
                      }}
                      className="p-1 text-slate-500 hover:text-rose-400"
                      title="حذف اسلاید"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Slide Title */}
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">تیتر اسلاید</label>
                  <input
                    type="text"
                    value={slide.title}
                    onChange={(e) => {
                      const updated = [...slides];
                      updated[idx].title = e.target.value;
                      setSlides(updated);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-1.5 text-xs font-bold text-white outline-none"
                  />
                </div>

                {/* Slide Body */}
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">متن محتوای اسلاید</label>
                  <textarea
                    rows={2}
                    value={slide.body}
                    onChange={(e) => {
                      const updated = [...slides];
                      updated[idx].body = e.target.value;
                      setSlides(updated);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg p-2.5 text-xs text-slate-200 outline-none resize-none leading-relaxed"
                  />
                </div>

                {/* Visual Direction */}
                <div className="flex items-center gap-1.5 text-[11px] text-amber-400/90 pt-1">
                  <ImageIcon className="w-3.5 h-3.5 shrink-0" />
                  <input
                    type="text"
                    value={slide.visualSuggestion}
                    onChange={(e) => {
                      const updated = [...slides];
                      updated[idx].visualSuggestion = e.target.value;
                      setSlides(updated);
                    }}
                    placeholder="پیشنهاد طراحی بصری برای طراح گرافیک یا ادیتور..."
                    className="w-full bg-transparent border-b border-transparent focus:border-amber-500/50 outline-none text-[11px] text-slate-400 hover:text-slate-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Interactive Slide Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>{isRtl ? 'پیش‌نمایش زنده اینستاگرام (۴:۵)' : 'Live Instagram Preview'}</span>
            </span>
            <span className="text-xs font-mono text-slate-400">
              {activePreviewIndex + 1} / {slides.length}
            </span>
          </div>

          {/* Instagram 4:5 Card Simulation */}
          <div className="glass-panel rounded-2xl p-4 border-slate-800 flex flex-col items-center">
            <div className="w-full max-w-[340px] aspect-[4/5] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/80 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden select-none">
              {/* Slide Header Indicator */}
              <div className="flex items-center justify-between text-xs text-slate-400 z-10">
                <span className="font-bold text-[11px] text-indigo-400 uppercase tracking-widest">
                  {workspace?.brandProfile.brandName || 'FLOW AI'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-800 text-[10px] font-mono">
                  {currentPreviewSlide?.slideNumber} / {slides.length}
                </span>
              </div>

              {/* Slide Main Content */}
              <div className="my-auto space-y-4 z-10">
                {currentPreviewSlide?.type === 'hook' && (
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                    ورق بزنید 👉
                  </span>
                )}
                <h3 className="text-lg font-black text-white leading-snug tracking-tight">
                  {currentPreviewSlide?.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {currentPreviewSlide?.body}
                </p>
              </div>

              {/* Slide Footer */}
              <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-[10px] text-slate-400 z-10">
                <span>{workspace?.brandProfile.primaryPlatform || 'Instagram'}</span>
                <span className="text-indigo-400 font-bold">@brand_handle</span>
              </div>

              {/* Visual Suggestion Badge Overlay */}
              <div className="absolute inset-x-2 bottom-2 p-2 rounded-xl bg-slate-950/90 border border-indigo-500/30 text-[10px] text-slate-300 backdrop-blur-md">
                <span className="text-amber-400 font-bold ml-1">پیشنهاد بصری:</span>
                <span>{currentPreviewSlide?.visualSuggestion}</span>
              </div>
            </div>

            {/* Slide Navigation Dots & Arrows */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => setActivePreviewIndex(Math.max(0, activePreviewIndex - 1))}
                disabled={activePreviewIndex === 0}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePreviewIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      activePreviewIndex === i
                        ? 'w-6 bg-indigo-500'
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() =>
                  setActivePreviewIndex(Math.min(slides.length - 1, activePreviewIndex + 1))
                }
                disabled={activePreviewIndex === slides.length - 1}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
