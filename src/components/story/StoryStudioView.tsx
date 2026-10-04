import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Flame,
  Plus,
  Trash2,
  Copy,
  Check,
  Save,
  MessageSquare,
  HelpCircle,
  BarChart2,
  Send,
  Loader2,
  Video,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateAIStorySequence } from '../../lib/aiActions';
import { StoryStep } from '../../types';

export const StoryStudioView: React.FC = () => {
  const {
    workspace,
    activeContent,
    updateContent,
    contents,
    lang,
  } = useApp();

  const isRtl = lang === 'fa';

  const [title, setTitle] = useState(activeContent?.title || 'رشته استوری تعاملی');
  const [topic, setTopic] = useState(activeContent?.title || '');
  const [goal, setGoal] = useState('افزایش انگیجمنت و هدایت به دایرکت');
  const [storyType, setStoryType] = useState<'Educational' | 'Engagement' | 'Sales' | 'Storytelling' | 'FAQ'>('Engagement');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [companionSourceId, setCompanionSourceId] = useState<string>('');

  const [steps, setSteps] = useState<StoryStep[]>(
    activeContent?.storySequence || [
      {
        stepNumber: 1,
        type: 'Hook',
        title: 'استوری ۱: قلاب شوکه‌کننده',
        text: 'بچه‌ها امروز یک اتفاق عجیب افتاد که کل فرضیاتم رو درباره فروش به هم ریخت...',
        interactionType: 'Emoji Slider',
        interactionDetails: 'اسلایدر آتش یا تعجب',
        visualSuggestion: 'ویدیو سلفی در حال راه رفتن یا فوتوکلیپ با بک‌گراند بلور',
      },
      {
        stepNumber: 2,
        type: 'Problem',
        title: 'استوری ۲: طرح درد مشترک',
        text: 'چند نفر از شما با وجود محتوای عالی، این ماه فروشتون به هدفش نرسیده؟',
        interactionType: 'Poll',
        interactionDetails: 'گزینه‌ها: متاسفانه من ✋ / خداروشکر خوب بود 🚀',
        visualSuggestion: 'پس‌زمینه تیره ساده با استیکر نظرسنجی وسط صفحه',
      },
      {
        stepNumber: 3,
        type: 'Value',
        title: 'استوری ۳: پرده‌برداری از نکته طلایی',
        text: 'دلیلش اینه که مسیر خرید رو سخت کردید. وقتی مسیر رو به ۲ مرحله کاهش دادیم، فروش ۲ برابر شد.',
        visualSuggestion: 'اسکرین‌شات دایرکت یا اسلاید گرافیکی مقایسه قبل و بعد',
      },
      {
        stepNumber: 4,
        type: 'Interaction',
        title: 'استوری ۴: استیکر تعاملی پرسش و پاسخ',
        text: 'بزرگترین چالش پیجت در حال حاضر چیه؟ برام بنویس تا ۳ تای اول رو استوری تحلیل کنم.',
        interactionType: 'Question Box',
        interactionDetails: 'باکس سوال با تیتر: چالشت رو بگو 👇',
        visualSuggestion: 'باکس سوال استاندارد اینستاگرام با فلش انیمیشنی',
      },
      {
        stepNumber: 5,
        type: 'CTA',
        title: 'استوری ۵: دعوت به اقدام مستقیم',
        text: 'اگر می‌خوای قالب آماده سناریونویسی رو دریافت کنی، همین الان کلمه «فلو» رو ریپلای کن.',
        interactionType: 'DM Keyword',
        interactionDetails: 'کلمه کلیدی دایرکت: فلو',
        visualSuggestion: 'عکس محصول همراه با دکمه ریپلای و ارسال پیام',
      },
    ]
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (activeContent?.storySequence && activeContent.storySequence.length > 0) {
      setSteps(activeContent.storySequence);
    }
  }, [activeContent?.id]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const sourceContent = contents.find((c) => c.id === companionSourceId);
      const generated = await generateAIStorySequence(workspace, {
        topic: topic || title,
        goal,
        productName: selectedProduct,
        storyType,
        sourceContentTitle: sourceContent?.title,
      });

      if (generated && generated.length > 0) {
        setSteps(generated);
        if (activeContent) {
          await updateContent(activeContent.id, { storySequence: generated });
        }
      }
    } catch (err) {
      console.error('Story generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (activeContent) {
      await updateContent(activeContent.id, {
        title,
        storySequence: steps,
        contentType: 'story',
      });
    }
  };

  const copyAllStories = () => {
    const text = steps
      .map(
        (s) => `[Story ${s.stepNumber} - ${s.type}] ${s.title}
متن استوری:
${s.text}
${s.interactionType ? `استیکر تعاملی: ${s.interactionType} (${s.interactionDetails || ''})` : ''}
پیشنهاد بصری: ${s.visualSuggestion}`
      )
      .join('\n\n---\n\n');

    navigator.clipboard.writeText(text);
    setCopiedKey('all');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const reelAndCarouselPosts = contents.filter(
    (c) => c.contentType === 'reel' || c.contentType === 'carousel'
  );

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-base sm:text-lg font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-orange-500 outline-none px-1 w-full"
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isRtl
              ? 'تولید رشته استوری‌های هدفمند ۵ مرحله‌ای (Hook → Problem → Value → Interaction → CTA)'
              : 'Story sequences optimized for high engagement algorithms and direct sales conversion.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={copyAllStories}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            {copiedKey === 'all' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isRtl ? 'کپی متن تمام استوری‌ها' : 'Copy All'}</span>
          </button>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isRtl ? 'در حال تولید رشته استوری...' : 'Generating...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>{isRtl ? 'تولید زنجیره استوری با AI' : 'Generate Sequence'}</span>
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

      {/* Generator Form & Companion Selector */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              موضوع رشته استوری یا کمپین
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="مثال: پشت صحنه سناریونویسی ویدیوی وایرال دیروز..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">نوع استوری</label>
            <select
              value={storyType}
              onChange={(e: any) => setStoryType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
            >
              <option value="Engagement">تعاملی (Engagement & Poll)</option>
              <option value="Sales">فروش مستقیم و آفر (Sales & DM)</option>
              <option value="Educational">آموزشی کوتاه (Micro-learning)</option>
              <option value="Storytelling">روایتگری شخصی (Storytelling)</option>
              <option value="FAQ">پاسخ به سوالات متداول (FAQ)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {isRtl ? 'استوری مکمل برای پست موجود (Companion)' : 'Supporting Companion Post'}
            </label>
            <select
              value={companionSourceId}
              onChange={(e) => setCompanionSourceId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
            >
              <option value="">{isRtl ? 'بدون پست مرجع (مستقل)' : 'Independent sequence'}</option>
              {reelAndCarouselPosts.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.contentType.toUpperCase()}] {p.title.substring(0, 30)}...
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Story Steps List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white">
            {isRtl ? 'زنجیره گام‌به‌گام استوری‌ها' : '5-Step Story Sequence'} ({steps.length} استوری)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {steps.map((step, idx) => {
            const stepColors = [
              'border-amber-500/50 bg-amber-500/5',
              'border-indigo-500/50 bg-indigo-500/5',
              'border-emerald-500/50 bg-emerald-500/5',
              'border-purple-500/50 bg-purple-500/5',
              'border-rose-500/50 bg-rose-500/5',
            ];
            const colorClass = stepColors[idx % stepColors.length];

            return (
              <div
                key={idx}
                className={`rounded-2xl border p-4 flex flex-col justify-between space-y-3 glass-panel ${colorClass}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold flex items-center justify-center text-white">
                      {step.stepNumber || idx + 1}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {step.type}
                    </span>
                  </div>

                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => {
                      const updated = [...steps];
                      updated[idx].title = e.target.value;
                      setSteps(updated);
                    }}
                    className="text-xs font-bold text-white bg-transparent border-b border-transparent focus:border-slate-700 outline-none w-full mb-2"
                  />

                  <textarea
                    rows={6}
                    value={step.text}
                    onChange={(e) => {
                      const updated = [...steps];
                      updated[idx].text = e.target.value;
                      setSteps(updated);
                    }}
                    className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 text-xs text-slate-200 outline-none resize-none leading-relaxed"
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  {/* Sticker suggestion */}
                  {step.interactionType && (
                    <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-[10px] space-y-1">
                      <div className="flex items-center gap-1 text-amber-400 font-bold">
                        <BarChart2 className="w-3 h-3" />
                        <span>استیکر: {step.interactionType}</span>
                      </div>
                      <div className="text-slate-300">{step.interactionDetails}</div>
                    </div>
                  )}

                  {/* Visual suggestion */}
                  <div className="text-[10px] text-slate-400 leading-snug">
                    <span className="text-indigo-400 font-bold block mb-0.5">تصویر:</span>
                    <span>{step.visualSuggestion}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
