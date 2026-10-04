import React, { useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  Save,
  Ban,
  Target,
  Volume2,
  Package,
  Building,
  CheckCircle2,
  Plus,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BrandMemoryView: React.FC = () => {
  const { workspace, updateWorkspace, lang } = useApp();
  const isRtl = lang === 'fa';

  const [brandName, setBrandName] = useState(workspace?.brandProfile.brandName || '');
  const [industry, setIndustry] = useState(workspace?.brandProfile.industry || '');
  const [description, setDescription] = useState(workspace?.brandProfile.businessDescription || '');
  const [mainGoal, setMainGoal] = useState(workspace?.brandProfile.mainGoal || '');
  const [platform, setPlatform] = useState(workspace?.brandProfile.primaryPlatform || 'Instagram');
  const [contentLanguage, setContentLanguage] = useState(workspace?.brandProfile.contentLanguage || 'فارسی (Persian)');

  const [voice, setVoice] = useState(workspace?.brandVoice || 'صمیمی (Friendly & Casual)');
  const [customStyle, setCustomStyle] = useState(workspace?.customVoiceStyle || '');

  const [forbiddenWords, setForbiddenWords] = useState<string[]>(workspace?.forbiddenWords || []);
  const [newForbiddenWord, setNewForbiddenWord] = useState('');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const voices = [
    'رسمی (Formal)',
    'صمیمی (Friendly & Casual)',
    'تخصصی (Expert & Authoritative)',
    'آموزشی (Educational & Instructive)',
    'جسور (Bold & Disruptive)',
    'مینیمال (Minimal & Punchy)',
    'طنز (Witty & Humorous)',
  ];

  const handleAddForbidden = () => {
    if (newForbiddenWord.trim() && !forbiddenWords.includes(newForbiddenWord.trim())) {
      setForbiddenWords([...forbiddenWords, newForbiddenWord.trim()]);
      setNewForbiddenWord('');
    }
  };

  const handleRemoveForbidden = (idx: number) => {
    setForbiddenWords(forbiddenWords.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    await updateWorkspace({
      brandProfile: {
        brandName,
        industry,
        businessDescription: description,
        mainGoal,
        primaryPlatform: platform as any,
        contentLanguage: contentLanguage as any,
      },
      brandVoice: voice,
      customVoiceStyle: customStyle,
      forbiddenWords,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-amber-400" />
            <span>{isRtl ? 'هسته حافظه برند (Brand Memory Core)' : 'Brand Memory Core'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isRtl
              ? 'مغز هوش مصنوعی Flow AI؛ هر ایده، سناریو و کپشن بر پایه این داده‌ها به صورت خودکار شخصی‌سازی می‌شود.'
              : 'The central context engine of Flow AI. Injected into every generation.'}
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/25 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isRtl ? 'ذخیره در حافظه برند' : 'Save Brand Memory'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>حافظه برند با موفقیت به‌روزرسانی و در دیتابیس ابری ذخیره شد.</span>
        </div>
      )}

      {/* Profile & Identity Card */}
      <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 border-b border-slate-800 pb-2">
          <Building className="w-4 h-4" />
          <span>{isRtl ? 'اطلاعات بنیادین کسب‌وکار' : 'Core Business Profile'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              نام رسمی برند
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              حوزه فعالیت تخصصی (Niche)
            </label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            شرح کسب‌وکار و راه‌حل شما برای بازار
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-white leading-relaxed outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">هدف اصلی پیج</label>
            <input
              type="text"
              value={mainGoal}
              onChange={(e) => setMainGoal(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">شبکه اصلی</label>
            <select
              value={platform}
              onChange={(e: any) => setPlatform(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
            >
              <option value="Instagram">Instagram</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Telegram">Telegram</option>
              <option value="YouTube">YouTube</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">زبان محتوا</label>
            <select
              value={contentLanguage}
              onChange={(e: any) => setContentLanguage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
            >
              <option value="فارسی (Persian)">فارسی (Persian)</option>
              <option value="English">English</option>
            </select>
          </div>
        </div>
      </div>

      {/* Voice & Tone Section */}
      <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 border-b border-slate-800 pb-2">
          <Volume2 className="w-4 h-4" />
          <span>{isRtl ? 'لحن و سبک اختصاصی برند (Brand Voice)' : 'Brand Voice'}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {voices.map((v) => (
            <button
              key={v}
              onClick={() => setVoice(v)}
              className={`p-3 rounded-xl border text-xs font-semibold transition-all text-right cursor-pointer ${
                voice === v
                  ? 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-sm'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            دستورالعمل تکمیلی لحن (Custom Style Guidance)
          </label>
          <textarea
            rows={2}
            value={customStyle}
            onChange={(e) => setCustomStyle(e.target.value)}
            placeholder="مثال: پرانرژی، بدون کلمات کلیشه‌ای، جملات ضربه‌ای و محاوره‌ای محترمانه..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none resize-none"
          />
        </div>
      </div>

      {/* Forbidden Words */}
      <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-rose-400 border-b border-slate-800 pb-2">
          <Ban className="w-4 h-4" />
          <span>{isRtl ? 'کلمات و خط‌قرمزهای ممنوعه (Forbidden Words)' : 'Forbidden Words'}</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          {isRtl
            ? 'هوش مصنوعی هرگز از این عبارات، ادعاهای زرد یا کلمات فیک در تولید سناریوها و قلاب‌ها استفاده نخواهد کرد.'
            : 'AI will strictly avoid these words or negative tropes in any generated copy.'}
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={newForbiddenWord}
            onChange={(e) => setNewForbiddenWord(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddForbidden())}
            placeholder="کلمه یا عبارت ممنوعه را بنویسید و اینتر بزنید..."
            className="flex-1 bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-xl px-4 py-2 text-xs text-white outline-none"
          />
          <button
            onClick={handleAddForbidden}
            className="px-4 py-2 bg-rose-600/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600/30 rounded-xl text-xs font-bold cursor-pointer"
          >
            افزودن به خط‌قرمزها
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {forbiddenWords.map((word, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 text-xs bg-rose-950/40 text-rose-300 border border-rose-800/60 px-3 py-1 rounded-full font-medium"
            >
              <span>{word}</span>
              <button
                onClick={() => handleRemoveForbidden(idx)}
                className="hover:text-rose-100 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
