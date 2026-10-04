import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Video,
  Clock,
  Camera,
  Scissors,
  Copy,
  Check,
  Save,
  Play,
  Volume2,
  Type,
  Plus,
  Trash2,
  Loader2,
  Calendar,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateAIReelBlueprint } from '../../lib/aiActions';
import { ReelBlueprint, ReelTimecode } from '../../types';

export const ReelStudioView: React.FC = () => {
  const {
    workspace,
    activeContent,
    updateContent,
    setCurrentView,
    lang,
  } = useApp();

  const isRtl = lang === 'fa';

  const [title, setTitle] = useState(activeContent?.title || 'طراحی سناریو و بلپرینت ریلز');
  const [duration, setDuration] = useState<'15 sec' | '30 sec' | '45 sec' | '60 sec' | 'Custom'>(
    activeContent?.reelBlueprint?.duration || '30 sec'
  );
  const [hook, setHook] = useState(activeContent?.reelBlueprint?.hook || activeContent?.hook || '');
  const [voiceover, setVoiceover] = useState(activeContent?.reelBlueprint?.voiceover || '');
  const [onScreenText, setOnScreenText] = useState(activeContent?.reelBlueprint?.onScreenText || '');
  const [cta, setCta] = useState(activeContent?.reelBlueprint?.cta || 'سیو کن تا یادت نره!');
  const [timecodes, setTimecodes] = useState<ReelTimecode[]>(
    activeContent?.reelBlueprint?.timecodes || [
      {
        timeRange: '00:00 - 00:03',
        title: 'هوک و کات اولیه',
        description: 'حرکت سریع به سمت دوربین و طرح سوال شوک‌آور',
        shotType: 'Talking Head',
        onScreenText: 'ویو ریلزت پایینه؟ ⛔',
        voiceover: 'اگه ریلزت ویو نمی‌خوره، این اشتباه رو متوقف کن!',
      },
      {
        timeRange: '00:03 - 00:15',
        title: 'مشکل و فاجعه پنهان',
        description: 'اسکرین‌شات آمار یا نمونه B-Roll کار با گوشی',
        shotType: 'B-Roll',
        onScreenText: 'مشکل: اوپن لوپ خراب',
        voiceover: 'بیشتر افراد توی ثانیه ۳ مخاطب رو خسته می‌کنند...',
      },
      {
        timeRange: '00:15 - 00:25',
        title: 'راه‌حل گام‌به‌گام',
        description: 'نمایش مرحله به مرحله تکنیک',
        shotType: 'Talking Head',
        onScreenText: 'راهکار اصلی',
        voiceover: 'این فرمول طلایی ۳ مرحله‌ای رو اجرا کن...',
      },
      {
        timeRange: '00:25 - 00:30',
        title: 'دعوت به اقدام و بستن حلقه',
        description: 'اشاره دست به گوشه تصویر برای سیو',
        shotType: 'Talking Head',
        onScreenText: 'سیو برای اجرا 📌',
        voiceover: 'این ویدیو رو ذخیره کن و دایرکت پیام بده!',
      },
    ]
  );

  const [shootingTips, setShootingTips] = useState<string[]>(
    activeContent?.reelBlueprint?.shootingTips || [
      'از نور روبرو (نور روز یا رینگ‌لایت ملایم) استفاده کنید تا صورت کاملا روشن باشد.',
      'گوشی را دقیقاً هم‌سطح چشم‌ها تنظیم کنید و کادر عمودی ۹:۱۶ بدون برش سر داشته باشید.',
      'قبل از شروع صحبت، لنز دوربین گوشی را با دستمال تمیز کنید.',
    ]
  );

  const [editingTips, setEditingTips] = useState<string[]>(
    activeContent?.reelBlueprint?.editingTips || [
      'سرعت کات‌ها هر ۲.۵ الی ۳ ثانیه برای حفظ ریتم ویدیو.',
      'افزودن زوم ملایم (Punch-in) در شروع جملات کلیدی.',
      'زیرنویس تک‌کلمه‌ای با تغییر رنگ کلمات کلیدی برای افزایش نگهداشت مخاطب.',
    ]
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (activeContent?.reelBlueprint) {
      const bp = activeContent.reelBlueprint;
      setDuration(bp.duration || '30 sec');
      setHook(bp.hook || activeContent.hook || '');
      setVoiceover(bp.voiceover || '');
      setOnScreenText(bp.onScreenText || '');
      setCta(bp.cta || '');
      if (bp.timecodes && bp.timecodes.length > 0) setTimecodes(bp.timecodes);
      if (bp.shootingTips && bp.shootingTips.length > 0) setShootingTips(bp.shootingTips);
      if (bp.editingTips && bp.editingTips.length > 0) setEditingTips(bp.editingTips);
    }
  }, [activeContent?.id]);

  const handleGenerateBlueprint = async () => {
    setIsGenerating(true);
    try {
      const bp = await generateAIReelBlueprint(workspace, {
        title,
        scenarioText: activeContent?.scenarioText || title,
        duration,
      });

      setDuration(bp.duration);
      setHook(bp.hook);
      setVoiceover(bp.voiceover);
      setOnScreenText(bp.onScreenText);
      setCta(bp.cta);
      setTimecodes(bp.timecodes);
      setShootingTips(bp.shootingTips);
      setEditingTips(bp.editingTips);

      if (activeContent) {
        await updateContent(activeContent.id, {
          reelBlueprint: bp,
          hook: bp.hook,
          cta: bp.cta,
        });
      }
    } catch (err) {
      console.error('Reel generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    const updatedBlueprint: ReelBlueprint = {
      duration,
      hook,
      scenario: activeContent?.scenarioText || title,
      voiceover,
      onScreenText,
      cta,
      timecodes,
      shootingTips,
      editingTips,
    };

    if (activeContent) {
      await updateContent(activeContent.id, {
        title,
        hook,
        cta,
        contentType: 'reel',
        reelBlueprint: updatedBlueprint,
      });
    }
  };

  const copyFullBlueprint = () => {
    const text = `
=== REEL PRODUCTION BLUEPRINT ===
عنوان: ${title}
مدت زمان: ${duration}
قلاب اولیه (Hook): ${hook}
متن روی تصویر: ${onScreenText}
دعوت به اقدام (CTA): ${cta}

--- متن صداگذاری (Voiceover) ---
${voiceover}

--- تایم‌کد و دکوپاژ صحنه‌ها ---
${timecodes
  .map(
    (tc) =>
      `[${tc.timeRange}] ${tc.title} (${tc.shotType})
نمایش: ${tc.description}
متن روی صفحه: ${tc.onScreenText}
دیالوگ: ${tc.voiceover}`
  )
  .join('\n\n')}

--- نکات فیلم‌برداری ---
${shootingTips.map((t, i) => `${i + 1}. ${t}`).join('\n')}

--- نکات تدوین و ادیت ---
${editingTips.map((t, i) => `${i + 1}. ${t}`).join('\n')}
`.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-rose-400" />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-base sm:text-lg font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-rose-500 outline-none px-1 w-full"
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isRtl
              ? 'بلپرینت کامل ریلز: تایم‌کدها، متن گویندگی، دکوپاژ تصویر و توصیه‌های فیلم‌برداری و ادیت'
              : 'End-to-end Reel blueprint with timecodes, voiceover, shot suggestions, and shooting/editing tips.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={copyFullBlueprint}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{isRtl ? 'کپی کل بلپرینت' : 'Copy Blueprint'}</span>
          </button>

          <button
            onClick={handleGenerateBlueprint}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-600/25 transition-all cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isRtl ? 'در حال طراحی بلپرینت...' : 'Generating...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isRtl ? 'تولید دکوپاژ با AI' : 'Generate with AI'}</span>
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

      {/* Duration Selector Tabs */}
      <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 overflow-x-auto max-w-full sm:max-w-fit">
        <span className="text-[11px] text-slate-400 font-bold px-2 shrink-0">{isRtl ? 'طول ویدیو:' : 'Duration:'}</span>
        {(['15 sec', '30 sec', '45 sec', '60 sec', 'Custom'] as const).map((d) => (
          <button
            key={d}
            onClick={() => setDuration(d)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              duration === d
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Grid: Left Timecodes Breakdown + Right Visual Director & Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Timecode Scene Breakdown */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel rounded-2xl p-5 border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-400" />
                <h3 className="text-xs font-bold text-white">
                  {isRtl ? 'دکوپاژ زمانی و تایم‌کدها (Timecode Breakdown)' : 'Timecode Breakdown'}
                </h3>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Total: {duration}</span>
            </div>

            <div className="space-y-3">
              {timecodes.map((tc, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        {tc.timeRange}
                      </span>
                      <input
                        type="text"
                        value={tc.title}
                        onChange={(e) => {
                          const updated = [...timecodes];
                          updated[idx].title = e.target.value;
                          setTimecodes(updated);
                        }}
                        className="text-xs font-bold text-white bg-transparent border-b border-transparent focus:border-slate-700 outline-none"
                      />
                    </div>

                    <select
                      value={tc.shotType}
                      onChange={(e: any) => {
                        const updated = [...timecodes];
                        updated[idx].shotType = e.target.value;
                        setTimecodes(updated);
                      }}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-0.5 text-[11px] text-indigo-300 outline-none"
                    >
                      <option value="Talking Head">Talking Head (رو به دوربین)</option>
                      <option value="B-Roll">B-Roll (تصویر مکمل)</option>
                      <option value="Screen Share">Screen Share (نمایش صفحه)</option>
                      <option value="Product Close-up">Product Close-up (نمای نزدیک محصول)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-0.5">چه چیزی نمایش داده شود؟</span>
                      <textarea
                        rows={2}
                        value={tc.description}
                        onChange={(e) => {
                          const updated = [...timecodes];
                          updated[idx].description = e.target.value;
                          setTimecodes(updated);
                        }}
                        className="w-full bg-slate-900/60 border border-slate-800/80 rounded-lg p-2 text-xs text-slate-300 outline-none resize-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-0.5">متن گویندگی (Voiceover)</span>
                      <textarea
                        rows={2}
                        value={tc.voiceover}
                        onChange={(e) => {
                          const updated = [...timecodes];
                          updated[idx].voiceover = e.target.value;
                          setTimecodes(updated);
                        }}
                        className="w-full bg-slate-900/60 border border-slate-800/80 rounded-lg p-2 text-xs text-amber-200 outline-none resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-slate-900">
                    <Type className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-[10px] text-slate-400 shrink-0">متن روی تصویر:</span>
                    <input
                      type="text"
                      value={tc.onScreenText}
                      onChange={(e) => {
                        const updated = [...timecodes];
                        updated[idx].onScreenText = e.target.value;
                        setTimecodes(updated);
                      }}
                      className="flex-1 bg-transparent border-b border-transparent focus:border-indigo-500 text-xs text-white outline-none px-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Complete Voiceover Box */}
          <div className="glass-panel rounded-2xl p-5 border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>{isRtl ? 'متن یکپارچه گویندگی (Voiceover Narration Script)' : 'Full Voiceover Script'}</span>
            </div>
            <textarea
              rows={4}
              value={voiceover}
              onChange={(e) => setVoiceover(e.target.value)}
              placeholder="متن کامل صداگذاری برای تمرین یا ضبط نریشین..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl p-3 text-xs text-slate-200 leading-relaxed outline-none resize-none"
            />
          </div>
        </div>

        {/* Right 1 Col: Production Advice, Shooting & Editing Tips */}
        <div className="space-y-4">
          {/* Visual Hook & CTA Card */}
          <div className="glass-panel rounded-2xl p-5 border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isRtl ? 'عناصر کلیدی ریلز' : 'Key Blueprint Elements'}</span>
            </h4>

            <div>
              <label className="text-[11px] text-amber-400 font-bold block mb-1">قلاب ثانیه اول (Hook)</label>
              <textarea
                rows={2}
                value={hook}
                onChange={(e) => setHook(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white outline-none resize-none"
              />
            </div>

            <div>
              <label className="text-[11px] text-indigo-400 font-bold block mb-1">دعوت به اقدام پایان (CTA)</label>
              <textarea
                rows={2}
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white outline-none resize-none"
              />
            </div>
          </div>

          {/* Shooting Tips */}
          <div className="glass-panel rounded-2xl p-5 border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
              <Camera className="w-4 h-4" />
              <span>{isRtl ? 'نکات فیلم‌برداری (Shooting Tips)' : 'Shooting Tips'}</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {shootingTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-[10px] shrink-0 font-bold">
                    {i + 1}
                  </span>
                  <span className="text-[11px] leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Editing Tips */}
          <div className="glass-panel rounded-2xl p-5 border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
              <Scissors className="w-4 h-4" />
              <span>{isRtl ? 'نکات تدوین و ادیت (Editing Tips)' : 'Editing Tips'}</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {editingTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] shrink-0 font-bold">
                    {i + 1}
                  </span>
                  <span className="text-[11px] leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
