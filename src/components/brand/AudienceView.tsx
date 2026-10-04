import React, { useState } from 'react';
import {
  Users,
  Target,
  Heart,
  AlertTriangle,
  Lightbulb,
  Save,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AudienceView: React.FC = () => {
  const { workspace, updateWorkspace, lang } = useApp();
  const isRtl = lang === 'fa';

  const [who, setWho] = useState(workspace?.targetAudience.who || '');
  const [needs, setNeeds] = useState(workspace?.targetAudience.needs || '');
  const [painPoints, setPainPoints] = useState(workspace?.targetAudience.painPoints || '');
  const [interests, setInterests] = useState(workspace?.targetAudience.interests || '');
  const [familiarity, setFamiliarity] = useState(workspace?.targetAudience.familiarityLevel || 'متوسط (Intermediate)');
  const [buyingReasons, setBuyingReasons] = useState(workspace?.targetAudience.buyingReasons || '');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async () => {
    await updateWorkspace({
      targetAudience: {
        who,
        needs,
        painPoints,
        interests,
        familiarityLevel: familiarity as any,
        buyingReasons,
      },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <span>{isRtl ? 'شناخت و پرسونای مخاطب هدف (Target Audience)' : 'Target Audience Persona'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isRtl
              ? 'قلاب‌ها و سناریوهای تولیدشده دقیقاً بر اساس دردهای ملموس و نیازهای این پرسونای هدف شخصی‌سازی می‌شوند.'
              : 'Defines the psychological trigger points for high conversion hooks and narratives.'}
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/25 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isRtl ? 'ذخیره پرسونای مخاطب' : 'Save Audience'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>پرسونای مخاطب با موفقیت در حافظه برند ذخیره شد.</span>
        </div>
      )}

      {/* Audience Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Who & Familiarity */}
        <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 border-b border-slate-800 pb-2">
            <Target className="w-4 h-4" />
            <span>{isRtl ? 'هویت و سطح آشنایی مخاطب' : 'Demographics & Awareness Level'}</span>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              مخاطب هدف شما دقیقا چه کسانی هستند؟
            </label>
            <input
              type="text"
              value={who}
              onChange={(e) => setWho(e.target.value)}
              placeholder="مثال: فریلنسرهای ۲۲ تا ۳۵ ساله، صاحبان فروشگاه‌های اینترنتی..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              سطح آشنایی مخاطب با موضوع فعالیت شما
            </label>
            <select
              value={familiarity}
              onChange={(e: any) => setFamiliarity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
            >
              <option value="تازه کار (Beginner)">تازه‌کار (نیاز به زبان بدون اصطلاح و فوق‌العاده ساده)</option>
              <option value="متوسط (Intermediate)">متوسط (اصول را می‌داند و دنبال تکنیک‌های رشد است)</option>
              <option value="پیشرفته (Pro)">حرفه‌ای و تخصصی (نیازمند تحلیل‌های آماری و عمیق)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              علاقه‌مندی‌ها و موضوعات محبوب
            </label>
            <input
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="مثال: رشد فردی، ابزارهای هوش مصنوعی، ترفندهای تکنولوژی..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
            />
          </div>
        </div>

        {/* Card 2: Pain Points & Desires */}
        <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-400 border-b border-slate-800 pb-2">
            <AlertTriangle className="w-4 h-4" />
            <span>{isRtl ? 'دردها و خواسته‌های درونی مخاطب' : 'Pain Points & Deep Desires'}</span>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              بزرگ‌ترین دردها، موانع و ترس‌های مخاطب (Pain Points)
            </label>
            <textarea
              rows={3}
              value={painPoints}
              onChange={(e) => setPainPoints(e.target.value)}
              placeholder="مثال: کمبود زمان برای سناریونویسی، بی‌نتیجه ماندن ویوها، عدم توانایی در فروش در استوری..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-xl p-3 text-xs text-white outline-none resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              خواسته‌ها و آرزوهای قلبی (Needs & Core Goals)
            </label>
            <textarea
              rows={3}
              value={needs}
              onChange={(e) => setNeeds(e.target.value)}
              placeholder="مثال: داشتن جریان ورودی مستمر مشتری، آزادی زمانی، شناخته شدن به عنوان مرجع..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-white outline-none resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              دلایل احتمالی خرید از شما به جای رقبا
            </label>
            <input
              type="text"
              value={buyingReasons}
              onChange={(e) => setBuyingReasons(e.target.value)}
              placeholder="مثال: پشتیبانی لحظه‌ای، کیفیت بی‌نظیر، آموزش عملی و بدون حاشیه..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
