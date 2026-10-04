import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  FileText,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  ChevronDown,
  Hash,
  Share2,
  Bookmark,
  MessageCircle,
  Save,
  Loader2,
  Wand2,
  Calendar,
  Layers,
  Video,
  Flame,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  generateAIScenario,
  generateAIHooks,
  rewriteAIScenario,
} from '../../lib/aiActions';

export const ScenarioStudioView: React.FC = () => {
  const {
    workspace,
    activeContent,
    updateContent,
    addContent,
    setCurrentView,
    lang,
  } = useApp();

  const isRtl = lang === 'fa';

  // Form states
  const [title, setTitle] = useState(activeContent?.title || 'سناریوی بدون عنوان');
  const [style, setStyle] = useState(activeContent?.copywritingStyle || 'Storytelling');
  const [selectedHook, setSelectedHook] = useState(activeContent?.hook || '');
  const [hooksList, setHooksList] = useState<string[]>(activeContent?.hooks || []);
  const [scenarioText, setScenarioText] = useState(activeContent?.scenarioText || '');
  const [caption, setCaption] = useState(activeContent?.caption || '');
  const [captionLength, setCaptionLength] = useState<'Short' | 'Medium' | 'Long'>('Medium');
  const [hashtags, setHashtags] = useState<string[]>(activeContent?.hashtags || []);
  const [cta, setCta] = useState(activeContent?.cta || 'سیو کن تا یادت نره!');
  const [scheduledDate, setScheduledDate] = useState(activeContent?.scheduledDate || '');
  const [scheduledTime, setScheduledTime] = useState(activeContent?.scheduledTime || '19:30');

  // Loading flags
  const [isGeneratingScenario, setIsGeneratingScenario] = useState(false);
  const [isGeneratingHooks, setIsGeneratingHooks] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (activeContent) {
      setTitle(activeContent.title);
      setSelectedHook(activeContent.hook || activeContent.title);
      setHooksList(activeContent.hooks || [activeContent.hook || activeContent.title]);
      setScenarioText(activeContent.scenarioText || '');
      setCaption(activeContent.caption || '');
      setHashtags(activeContent.hashtags || []);
      setCta(activeContent.cta || '');
      setScheduledDate(activeContent.scheduledDate || '');
      setScheduledTime(activeContent.scheduledTime || '19:30');
    }
  }, [activeContent?.id]);

  const copywritingStyles = [
    { id: 'Storytelling', label: 'داستان‌سرایی (Storytelling)' },
    { id: 'Educational', label: 'آموزشی گام‌به‌گام (Educational)' },
    { id: 'ProblemSolution', label: 'مشکل / راه‌حل (Problem / Solution)' },
    { id: 'Challenge', label: 'چالش و آزمایش (Challenge)' },
    { id: 'List', label: 'لیست ضربه‌ای (Listicle)' },
    { id: 'Contrarian', label: 'خلاف‌جهت و ساختارشکن (Contrarian)' },
    { id: 'Sales', label: 'فروش مستقیم / آفر (Direct Sales)' },
  ];

  const ctaOptions = [
    { label: 'ذخیره (Save)', text: 'این پست رو سیو کن تا موقع نیاز حتما چکش کنی!' },
    { label: 'اشتراک (Share)', text: 'این ترفند رو برای دوستی که بهش نیاز داره بفرست!' },
    { label: 'کامنت (Comment)', text: 'تو کدوم مرحله هستی؟ نظرت رو توی کامنت‌ها بگو!' },
    { label: 'دایرکت (DM)', text: 'کلمه «شروع» را دایرکت کن تا راهنما را برات بفرستیم.' },
    { label: 'خرید (Offer)', text: 'برای ثبت‌نام با ۵۰٪ تخفیف ویژه به لینک بایو مراجعه کن.' },
  ];

  // 1. Generate / Regenerate Full Scenario
  const handleGenerateScenario = async () => {
    setIsGeneratingScenario(true);
    try {
      const res = await generateAIScenario(workspace, {
        title,
        description: scenarioText || title,
        style,
        goal: 'تعامل و اقدام مشخص',
        selectedHook,
      });

      setSelectedHook(res.hook);
      setHooksList(res.hooks);
      setScenarioText(res.scenarioText);
      setCaption(res.caption);
      setHashtags(res.hashtags);
      setCta(res.cta);

      if (activeContent) {
        await updateContent(activeContent.id, {
          hook: res.hook,
          hooks: res.hooks,
          scenarioText: res.scenarioText,
          caption: res.caption,
          hashtags: res.hashtags,
          cta: res.cta,
          copywritingStyle: style,
        });
      }
    } catch (err) {
      console.error('Scenario generation failed:', err);
    } finally {
      setIsGeneratingScenario(false);
    }
  };

  // 2. Generate More Viral Hooks (Low latency)
  const handleGenerateHooks = async () => {
    setIsGeneratingHooks(true);
    try {
      const hooks = await generateAIHooks(workspace, title, style, 4);
      setHooksList(hooks);
      if (hooks.length > 0) {
        setSelectedHook(hooks[0]);
      }
    } catch (err) {
      console.error('Hooks generation error:', err);
    } finally {
      setIsGeneratingHooks(false);
    }
  };

  // 3. AI Rewrite Actions (Low latency gemini-3.1-flash-lite)
  const handleRewrite = async (
    action: 'shorter' | 'longer' | 'catchy' | 'friendly' | 'expert' | 'simple' | 'regenerate'
  ) => {
    if (!scenarioText.trim()) return;
    setIsRewriting(true);
    try {
      const rewritten = await rewriteAIScenario(workspace, scenarioText, action);
      setScenarioText(rewritten.trim());
      if (activeContent) {
        await updateContent(activeContent.id, { scenarioText: rewritten.trim() });
      }
    } catch (err) {
      console.error('Rewrite failed:', err);
    } finally {
      setIsRewriting(false);
    }
  };

  // Save changes
  const handleSave = async () => {
    if (activeContent) {
      await updateContent(activeContent.id, {
        title,
        hook: selectedHook,
        hooks: hooksList,
        scenarioText,
        caption,
        hashtags,
        cta,
        scheduledDate,
        scheduledTime,
        copywritingStyle: style,
        status: scheduledDate ? 'scheduled' : 'ready',
        stage: scheduledDate ? 'scheduled' : 'scenario',
      });
    } else {
      await addContent({
        title,
        contentType: 'scenario',
        stage: 'scenario',
        status: 'ready',
        hook: selectedHook,
        hooks: hooksList,
        scenarioText,
        caption,
        hashtags,
        cta,
        scheduledDate,
        scheduledTime,
      });
    }
  };

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-base sm:text-lg font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-indigo-500 outline-none px-1 w-full"
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isRtl
              ? 'سناریونویس تخصصی مبتنی بر سبک‌های معتبر کپی‌رایتینگ و متصل به حافظه برند'
              : 'Direct copywriting studio grounded in Brand Memory and audience psychology.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleGenerateScenario}
            disabled={isGeneratingScenario}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            {isGeneratingScenario ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isRtl ? 'در حال تولید سناریو...' : 'Generating...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isRtl ? 'تولید سناریوی کامل با AI' : 'Generate Full Script'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isRtl ? 'ذخیره تغییرات' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Editor & Right Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Hook + Scenario Script + Caption */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Hook Generator Card */}
          <div className="glass-panel rounded-2xl p-5 border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400">⚡ {isRtl ? 'قلاب توقف اسکرول (Hook Selector)' : 'Viral Hook Options'}</span>
                <span className="text-[10px] text-slate-500">(۳ ثانیه اول)</span>
              </div>
              <button
                onClick={handleGenerateHooks}
                disabled={isGeneratingHooks}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {isGeneratingHooks ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                <span>{isRtl ? 'تولید هوک‌های جدید' : 'More Hooks'}</span>
              </button>
            </div>

            {/* Hook options */}
            <div className="space-y-2">
              {hooksList.map((h, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedHook(h)}
                  className={`p-3 rounded-xl border text-xs leading-relaxed flex items-center justify-between cursor-pointer transition-all ${
                    selectedHook === h
                      ? 'bg-amber-500/10 border-amber-500/50 text-amber-200 font-semibold shadow-sm'
                      : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{h}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    {selectedHook === h && <Check className="w-4 h-4 text-amber-400" />}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(`hook-${i}`, h);
                      }}
                      className="p-1 text-slate-400 hover:text-white"
                      title="کپی"
                    >
                      {copiedKey === `hook-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Main Scenario Editor */}
          <div className="glass-panel rounded-2xl p-5 border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold text-white">
                  {isRtl ? 'متن کامل سناریو و دیالوگ‌ها (Script Editor)' : 'Script Editor'}
                </h3>
              </div>
              <button
                onClick={() => copyToClipboard('scenario', scenarioText)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'scenario' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isRtl ? 'کپی کل سناریو' : 'Copy Script'}</span>
              </button>
            </div>

            {/* AI Fast Rewrite Toolbar */}
            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-500 font-bold ml-1">AI Rewrite:</span>
              {[
                { action: 'shorter', label: 'کوتاه‌تر' },
                { action: 'longer', label: 'طولانی‌تر' },
                { action: 'catchy', label: 'جذاب‌تر' },
                { action: 'friendly', label: 'صمیمی‌تر' },
                { action: 'expert', label: 'تخصصی‌تر' },
                { action: 'simple', label: 'ساده‌تر' },
                { action: 'regenerate', label: 'دوباره بنویس' },
              ].map((btn) => (
                <button
                  key={btn.action}
                  onClick={() => handleRewrite(btn.action as any)}
                  disabled={isRewriting || !scenarioText.trim()}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-indigo-600/30 text-slate-300 hover:text-white border border-slate-800 hover:border-indigo-500/40 transition-colors cursor-pointer"
                >
                  {btn.label}
                </button>
              ))}
              {isRewriting && <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400 mr-2" />}
            </div>

            <textarea
              rows={10}
              value={scenarioText}
              onChange={(e) => setScenarioText(e.target.value)}
              placeholder={isRtl ? 'متن سناریو، دیالوگ‌ها و دستورات اجرایی اینجا نمایش داده می‌شود...' : 'Enter your script...'}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-4 text-xs text-white leading-relaxed outline-none resize-none font-sans"
            />
          </div>

          {/* 3. Caption, CTA & Hashtags Card */}
          <div className="glass-panel rounded-2xl p-5 border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-white">
                {isRtl ? 'کپشن و هشتگ‌ها (Caption & Hashtags)' : 'Caption & Hashtags'}
              </h3>
              <button
                onClick={() =>
                  copyToClipboard(
                    'full-post',
                    `${caption}\n\n${cta}\n\n${hashtags.map((h) => `#${h}`).join(' ')}`
                  )
                }
                className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'full-post' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isRtl ? 'کپی تمام پست (کپشن + CTA + هشتگ)' : 'Copy All'}</span>
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">متن کپشن</label>
                <button
                  onClick={() => copyToClipboard('caption', caption)}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedKey === 'caption' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>کپی کپشن</span>
                </button>
              </div>
              <textarea
                rows={5}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="متن کپشن آماده با ایموجی و ساختار پاراگرافی..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-white leading-relaxed outline-none resize-none"
              />
            </div>

            {/* CTA Selector */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">دعوت به اقدام نهایی (CTA)</label>
                <button
                  onClick={() => copyToClipboard('cta', cta)}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedKey === 'cta' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>کپی CTA</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {ctaOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCta(opt.text)}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-indigo-300 font-semibold outline-none"
              />
            </div>

            {/* Hashtags */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">هشتگ‌های پیشنهادی</label>
                <button
                  onClick={() =>
                    copyToClipboard('hashtags', hashtags.map((h) => `#${h}`).join(' '))
                  }
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedKey === 'hashtags' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>کپی هشتگ‌ها</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {hashtags.map((h, i) => (
                  <span
                    key={i}
                    className="text-[11px] bg-slate-900 border border-slate-800 text-indigo-400 px-2 py-0.5 rounded-full"
                  >
                    #{h}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Style, Format Conversion & Schedule */}
        <div className="space-y-6">
          {/* Copywriting Style Selector */}
          <div className="glass-panel rounded-2xl p-5 border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>{isRtl ? 'سبک کپی‌رایتینگ' : 'Copywriting Style'}</span>
            </h4>
            <div className="space-y-1.5">
              {copywritingStyles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`w-full text-right p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                    style === s.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Convert to Format Studio */}
          <div className="glass-panel rounded-2xl p-5 border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white">
              {isRtl ? 'انتقال به استودیوهای تخصصی' : 'Open in Dedicated Studio'}
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => {
                  handleSave();
                  setCurrentView('reel-studio');
                }}
                className="w-full p-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-rose-500/40 flex items-center justify-between text-xs text-white transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-rose-400" />
                  <span>{isRtl ? 'ساخت Reel با تایم‌کد' : 'Convert to Reel'}</span>
                </div>
                <span className="text-[10px] text-slate-500">9:16</span>
              </button>

              <button
                onClick={() => {
                  handleSave();
                  setCurrentView('carousel-studio');
                }}
                className="w-full p-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 flex items-center justify-between text-xs text-white transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>{isRtl ? 'ساخت کاروسل اسلایدی' : 'Convert to Carousel'}</span>
                </div>
                <span className="text-[10px] text-slate-500">Slides</span>
              </button>

              <button
                onClick={() => {
                  handleSave();
                  setCurrentView('story-studio');
                }}
                className="w-full p-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-orange-500/40 flex items-center justify-between text-xs text-white transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span>{isRtl ? 'ساخت رشته استوری مکمل' : 'Convert to Story'}</span>
                </div>
                <span className="text-[10px] text-slate-500">Story</span>
              </button>
            </div>
          </div>

          {/* Schedule to Calendar */}
          <div className="glass-panel rounded-2xl p-5 border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>{isRtl ? 'افزودن به تقویم انتشار' : 'Schedule to Calendar'}</span>
            </h4>
            <div className="space-y-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">تاریخ انتشار</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">ساعت انتشار</label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white outline-none"
                />
              </div>
              <button
                onClick={handleSave}
                className="w-full mt-2 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                {isRtl ? 'تأیید و زمان‌بندی در تقویم' : 'Save & Schedule'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
