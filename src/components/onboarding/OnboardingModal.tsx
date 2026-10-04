import React, { useState } from 'react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Building,
  Target,
  Volume2,
  Ban,
  Package,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductService } from '../../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { workspace, updateWorkspace, lang } = useApp();
  const [step, setStep] = useState(1);

  const [brandName, setBrandName] = useState(workspace?.brandProfile.brandName || '');
  const [industry, setIndustry] = useState(workspace?.brandProfile.industry || '');
  const [description, setDescription] = useState(workspace?.brandProfile.businessDescription || '');
  const [mainGoal, setMainGoal] = useState(workspace?.brandProfile.mainGoal || '');
  const [platform, setPlatform] = useState(workspace?.brandProfile.primaryPlatform || 'Instagram');
  const [contentLanguage, setContentLanguage] = useState(workspace?.brandProfile.contentLanguage || 'فارسی (Persian)');

  const [voice, setVoice] = useState(workspace?.brandVoice || 'صمیمی (Friendly & Casual)');
  const [customStyle, setCustomStyle] = useState(workspace?.customVoiceStyle || '');

  const [whoAudience, setWhoAudience] = useState(workspace?.targetAudience.who || '');
  const [needs, setNeeds] = useState(workspace?.targetAudience.needs || '');
  const [painPoints, setPainPoints] = useState(workspace?.targetAudience.painPoints || '');
  const [interests, setInterests] = useState(workspace?.targetAudience.interests || '');
  const [familiarity, setFamiliarity] = useState(workspace?.targetAudience.familiarityLevel || 'متوسط (Intermediate)');
  const [buyingReasons, setBuyingReasons] = useState(workspace?.targetAudience.buyingReasons || '');

  const [forbiddenList, setForbiddenList] = useState<string[]>(workspace?.forbiddenWords || []);
  const [newForbiddenWord, setNewForbiddenWord] = useState('');

  const [products, setProducts] = useState<ProductService[]>(workspace?.products || []);
  const [newProdName, setNewProdName] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdCta, setNewProdCta] = useState('');

  const isRtl = lang === 'fa';

  if (!isOpen) return null;

  const handleAddForbidden = () => {
    if (newForbiddenWord.trim() && !forbiddenList.includes(newForbiddenWord.trim())) {
      setForbiddenList([...forbiddenList, newForbiddenWord.trim()]);
      setNewForbiddenWord('');
    }
  };

  const handleRemoveForbidden = (index: number) => {
    setForbiddenList(forbiddenList.filter((_, i) => i !== index));
  };

  const handleAddProduct = () => {
    if (newProdName.trim()) {
      const newP: ProductService = {
        id: 'prod-' + Date.now(),
        name: newProdName.trim(),
        description: newProdDesc.trim(),
        features: '',
        benefits: '',
        targetAudience: '',
        mainCta: newProdCta.trim() || 'ارسال دایرکت برای اطلاعات بیشتر',
      };
      setProducts([...products, newP]);
      setNewProdName('');
      setNewProdDesc('');
      setNewProdCta('');
    }
  };

  const handleSaveAll = async () => {
    await updateWorkspace({
      brandProfile: {
        brandName: brandName || 'برند من',
        industry: industry || 'خدمات و آموزش',
        businessDescription: description || '',
        mainGoal: mainGoal || 'جذب مخاطب و فروش',
        primaryPlatform: platform,
        contentLanguage: contentLanguage,
      },
      brandVoice: voice,
      customVoiceStyle: customStyle,
      targetAudience: {
        who: whoAudience,
        needs,
        painPoints,
        interests,
        familiarityLevel: familiarity,
        buyingReasons,
      },
      forbiddenWords: forbiddenList,
      products,
    });
    onClose();
  };

  const voices = [
    'رسمی (Formal)',
    'صمیمی (Friendly & Casual)',
    'تخصصی (Expert & Authoritative)',
    'آموزشی (Educational & Instructive)',
    'جسور (Bold & Disruptive)',
    'مینیمال (Minimal & Punchy)',
    'طنز (Witty & Humorous)',
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-amber-500 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {isRtl ? 'راه‌اندازی هویت و حافظه برند (Brand Memory)' : 'Brand Memory Setup'}
              </h2>
              <p className="text-xs text-slate-400">
                {isRtl
                  ? 'این اطلاعات یک‌بار وارد شده و هوش مصنوعی در تولید تمام ایده‌ها و سناریوها آن را اعمال می‌کند.'
                  : 'Configure once, AI will tailor all scenarios and ideas to your brand.'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 border-b border-slate-800/80 bg-slate-950/30 flex items-center justify-between text-xs">
          {[
            { num: 1, label: 'اطلاعات برند', icon: Building },
            { num: 2, label: 'مخاطب هدف', icon: Target },
            { num: 3, label: 'لحن و خط‌قرمزها', icon: Volume2 },
            { num: 4, label: 'محصولات و خدمات', icon: Package },
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => setStep(s.num)}
              className={`flex items-center gap-2 font-medium transition-colors ${
                step === s.num
                  ? 'text-indigo-400 font-bold'
                  : step > s.num
                  ? 'text-emerald-400'
                  : 'text-slate-500'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step === s.num
                    ? 'bg-indigo-600 text-white'
                    : step > s.num
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Step 1: Brand Profile */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    نام برند یا کسب‌وکار *
                  </label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="مثال: دیجی‌آموز، کافه لاته، ..."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    حوزه فعالیت (Niche)
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="مثال: آموزش سرمایه‌گذاری، طراحی لباس، سئو..."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  توضیح کوتاه درباره کسب‌وکار شما
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="کسب‌وکار شما دقیقا چه کاری انجام می‌دهد و چه مشکلی از افراد را حل می‌کند؟"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg p-3 text-xs text-white outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    هدف اصلی پیج
                  </label>
                  <input
                    type="text"
                    value={mainGoal}
                    onChange={(e) => setMainGoal(e.target.value)}
                    placeholder="مثال: افزایش فالوور هدفمند و فروش مستقیم"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    شبکه اجتماعی اصلی
                  </label>
                  <select
                    value={platform}
                    onChange={(e: any) => setPlatform(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="Instagram">اینستاگرام (Instagram)</option>
                    <option value="LinkedIn">لینکدین (LinkedIn)</option>
                    <option value="Telegram">تلگرام (Telegram)</option>
                    <option value="YouTube">یوتیوب (YouTube)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    زبان محتوا
                  </label>
                  <select
                    value={contentLanguage}
                    onChange={(e: any) => setContentLanguage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="فارسی (Persian)">فارسی (Persian)</option>
                    <option value="English">English</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Target Audience */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  مخاطب هدف چه کسانی هستند؟ (Persona)
                </label>
                <input
                  type="text"
                  value={whoAudience}
                  onChange={(e) => setWhoAudience(e.target.value)}
                  placeholder="مثال: دختران جوان دانشجو، فریلنسرهای دورکار، مدیران شرکت‌ها..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    بزرگ‌ترین دردها و مشکلات مخاطب (Pain Points)
                  </label>
                  <textarea
                    rows={3}
                    value={painPoints}
                    onChange={(e) => setPainPoints(e.target.value)}
                    placeholder="چه مسائلی شب‌ها خواب را از آن‌ها می‌گیرد؟ چه مشکلاتی در این حوزه دارند؟"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg p-3 text-xs text-white outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    نیازها و خواسته‌های قلبی (Needs & Desires)
                  </label>
                  <textarea
                    rows={3}
                    value={needs}
                    onChange={(e) => setNeeds(e.target.value)}
                    placeholder="می‌خواهند به چه جایگاهی برسند؟ چه آرزو و نتیجه‌ای برایشان جذاب است؟"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg p-3 text-xs text-white outline-none resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    سطح آشنایی مخاطب با موضوع
                  </label>
                  <select
                    value={familiarity}
                    onChange={(e: any) => setFamiliarity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="تازه کار (Beginner)">تازه‌کار (مبتدی، نیازمند زبان فوق‌العاده ساده)</option>
                    <option value="متوسط (Intermediate)">متوسط (اصول را بلد است، دنبال ترفندهاست)</option>
                    <option value="پیشرفته (Pro)">حرفه‌ای و متخصص (نیازمند داده‌ها و تحلیل‌های عمیق)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    دلایل احتمالی خرید از شما
                  </label>
                  <input
                    type="text"
                    value={buyingReasons}
                    onChange={(e) => setBuyingReasons(e.target.value)}
                    placeholder="چرا از شما بخرند؟ قیمت؟ پشتیبانی؟ سادگی کار؟"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Brand Voice & Forbidden Words */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  لحن اصلی برند (Brand Voice)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {voices.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setVoice(v)}
                      className={`p-2.5 rounded-lg border text-xs font-medium text-right transition-all cursor-pointer ${
                        voice === v
                          ? 'bg-indigo-600/30 border-indigo-500 text-white font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  دستورالعمل اختصاصی سبک و لحن (Style Guidance)
                </label>
                <textarea
                  rows={2}
                  value={customStyle}
                  onChange={(e) => setCustomStyle(e.target.value)}
                  placeholder="مثال: پرانرژی، بدون کلمات قلمبه‌سلمبه، جملات کوتاه و ضربه‌ای، شوخ‌طبع اما متین..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg p-3 text-xs text-white outline-none resize-none"
                />
              </div>

              {/* Forbidden Words */}
              <div>
                <div className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-rose-400">
                  <Ban className="w-4 h-4" />
                  <span>کلمات و عبارات ممنوعه (Forbidden Words)</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-2">
                  کلماتی که هوش مصنوعی تحت هیچ شرایطی نباید در متن‌ها و هوک‌ها استفاده کند (مثل کلمات زرد یا ادعاهای دروغین):
                </p>

                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newForbiddenWord}
                    onChange={(e) => setNewForbiddenWord(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddForbidden())}
                    placeholder="کلمه یا عبارت ممنوعه را تایپ کرده و اینتر بزنید..."
                    className="flex-1 bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-lg px-3 py-2 text-xs text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddForbidden}
                    className="px-3 py-2 bg-rose-600/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600/30 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    افزودن
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {forbiddenList.map((word, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-[11px] bg-rose-950/40 text-rose-300 border border-rose-800/60 px-2 py-0.5 rounded-full"
                    >
                      <span>{word}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveForbidden(idx)}
                        className="hover:text-rose-100"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Products / Services */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h3 className="text-xs font-semibold text-slate-300 mb-1">
                  کاتالوگ محصولات و خدمات شما
                </h3>
                <p className="text-[11px] text-slate-400 mb-3">
                  هوش مصنوعی در ایده‌پردازی و نوشتن CTA مستقیماً به این محصولات ارجاع می‌دهد.
                </p>
              </div>

              {/* Add Product Form */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="نام محصول یا خدمت..."
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none"
                  />
                  <input
                    type="text"
                    value={newProdCta}
                    onChange={(e) => setNewProdCta(e.target.value)}
                    placeholder="دعوت به اقدام (مثال: ارسال کلمه رشد در دایرکت)..."
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <input
                  type="text"
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="توضیح کوتاه و فایده اصلی برای خریدار..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="w-full py-2 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ثبت محصول در حافظه برند</span>
                </button>
              </div>

              {/* Existing Products List */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {products.length === 0 ? (
                  <div className="text-center py-4 text-xs text-slate-500">
                    هنوز محصولی ثبت نشده است. می‌توانید در مرحله بعد هم اضافه کنید.
                  </div>
                ) : (
                  products.map((p, idx) => (
                    <div
                      key={p.id || idx}
                      className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{p.name}</div>
                        <div className="text-[11px] text-slate-400">{p.description}</div>
                        {p.mainCta && (
                          <div className="text-[10px] text-indigo-400 mt-1">CTA: {p.mainCta}</div>
                        )}
                      </div>
                      <button
                        onClick={() => setProducts(products.filter((_, i) => i !== idx))}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
              <span>مرحله قبل</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/25 cursor-pointer"
            >
              <span>مرحله بعد</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSaveAll}
              className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/25 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>ذخیره در حافظه برند و شروع</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
