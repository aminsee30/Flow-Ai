import React, { useState } from 'react';
import {
  Sparkles,
  Lightbulb,
  Video,
  Layers,
  Flame,
  Calendar as CalendarIcon,
  Kanban,
  ArrowRight,
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  TrendingUp,
  BrainCircuit,
  Loader2,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { quickDashboardAI } from '../../lib/aiActions';

export const DashboardView: React.FC = () => {
  const {
    workspace,
    setCurrentView,
    ideas,
    contents,
    addContent,
    setActiveContentId,
    lang,
  } = useApp();

  const [quickInput, setQuickInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [quickResult, setQuickResult] = useState<any | null>(null);

  const isRtl = lang === 'fa';

  // Pipeline counts
  const stageCounts = {
    idea: ideas.length,
    scenario: contents.filter((c) => c.stage === 'scenario').length,
    production: contents.filter((c) => c.stage === 'production').length,
    ready: contents.filter((c) => c.stage === 'ready').length,
    scheduled: contents.filter((c) => c.stage === 'scheduled' || c.scheduledDate).length,
    published: contents.filter((c) => c.stage === 'published' || c.status === 'published').length,
  };

  // Upcoming content
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const todayContent = contents.filter((c) => c.scheduledDate === todayStr);
  const tomorrowContent = contents.filter((c) => c.scheduledDate === tomorrowStr);
  const upcomingThisWeek = contents.filter(
    (c) => c.scheduledDate && c.scheduledDate > tomorrowStr
  );

  const handleQuickCreate = async (customPrompt?: string) => {
    const text = customPrompt || quickInput.trim();
    if (!text) return;

    setIsGenerating(true);
    setQuickResult(null);

    try {
      const res = await quickDashboardAI(workspace, text);
      setQuickResult(res);
    } catch (err) {
      console.error('Quick AI Generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAcceptQuickCreate = async () => {
    if (!quickResult) return;

    const newId = await addContent({
      title: quickResult.title,
      contentType: quickResult.contentType || 'reel',
      stage: 'scenario',
      status: 'in_progress',
      hook: quickResult.hook || quickResult.title,
      hooks: [quickResult.hook || quickResult.title],
      scenarioText: quickResult.scenarioText || quickResult.description,
      caption: quickResult.caption || '',
      hashtags: quickResult.hashtags || ['تولید_محتوا', 'رشد'],
      cta: quickResult.cta || '',
    });

    setActiveContentId(newId);

    if (quickResult.contentType === 'reel') {
      setCurrentView('reel-studio');
    } else if (quickResult.contentType === 'carousel') {
      setCurrentView('carousel-studio');
    } else if (quickResult.contentType === 'story') {
      setCurrentView('story-studio');
    } else {
      setCurrentView('scenario-studio');
    }
  };

  const sampleQuickPrompts = [
    'برای پکیج سناریونویسی یک ریلز آموزشی و پربازدید بساز',
    'یک کاروسل ۵ اسلایدی درباره اشتباهات رایج کسب‌وکارهای آنلاین بنویس',
    'یک رشته استوری تعاملی برای معرفی خدمت جدید طراحی کن',
  ];

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      {/* Welcome & Brand Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/20 p-4 sm:p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isRtl ? 'حافظه برند فعال است' : 'Brand Memory Active'}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              {workspace?.brandProfile.brandName || 'Flow AI'}
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-xl">
              {isRtl
                ? `لحن فعلی: ${workspace?.brandVoice} • هدف: ${workspace?.brandProfile.mainGoal}`
                : `Voice: ${workspace?.brandVoice} • Goal: ${workspace?.brandProfile.mainGoal}`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setCurrentView('brand-memory')}
              className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/70 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <BrainCircuit className="w-4 h-4 text-amber-400" />
              <span>{isRtl ? 'ویرایش حافظه برند' : 'Edit Memory'}</span>
            </button>
            <button
              onClick={() => setCurrentView('calendar')}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <CalendarIcon className="w-4 h-4" />
              <span>{isRtl ? 'تقویم انتشار' : 'Content Calendar'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. AI Quick Create Hero Input */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 relative overflow-hidden border-indigo-500/30">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white">
            {isRtl ? 'امروز چه محتوایی می‌خواهی بسازی؟' : 'What content do you want to create today?'}
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          {isRtl
            ? 'یک ایده یا درخواست کلی بنویسید؛ هوش مصنوعی براساس حافظه برند، سناریو و ساختار اجرایی را می‌سازد.'
            : 'Type your rough concept; AI will formulate full script & format based on your brand memory.'}
        </p>

        <div className="relative">
          <textarea
            rows={2}
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder={
              isRtl
                ? 'مثال: برای خدمات طراحی سایت یک ریلز آموزشی با قلاب توقف اسکرول بساز...'
                : 'e.g. Create an educational reel for my web design offer...'
            }
            className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 sm:p-4 text-xs text-white placeholder-slate-500 outline-none resize-none shadow-inner"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3">
            <div className="flex flex-wrap gap-1.5 max-w-full sm:max-w-2xl">
              {sampleQuickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuickInput(p);
                    handleQuickCreate(p);
                  }}
                  disabled={isGenerating}
                  className="text-[11px] text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-right"
                >
                  ⚡ {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleQuickCreate()}
              disabled={isGenerating || !quickInput.trim()}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer shrink-0"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isRtl ? 'در حال خلق محتوا...' : 'Generating...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{isRtl ? 'تولید با هوش مصنوعی' : 'Generate with AI'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Result Preview Card */}
        {quickResult && (
          <div className="mt-5 p-4 rounded-xl bg-slate-950/90 border border-indigo-500/40 animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                  {quickResult.contentType}
                </span>
                <h4 className="text-xs font-bold text-white">{quickResult.title}</h4>
              </div>
              <button
                onClick={handleAcceptQuickCreate}
                className="w-full sm:w-auto justify-center px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <span>{isRtl ? 'تکمیل در استودیو' : 'Open in Studio'}</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-2 mt-3 pt-3 border-t border-slate-800">
              <div>
                <span className="text-amber-400 font-bold ml-1">{isRtl ? 'قلاب (Hook):' : 'Hook:'}</span>
                <span>{quickResult.hook}</span>
              </div>
              <div className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">
                {quickResult.scenarioText}
              </div>
              {quickResult.cta && (
                <div className="text-[11px] text-indigo-300">
                  <span className="font-bold ml-1">CTA:</span>
                  <span>{quickResult.cta}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2. Quick Actions */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          {isRtl ? 'اقدامات سریع' : 'Quick Actions'}
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
          {[
            {
              id: 'ideas',
              title: isRtl ? 'ساخت ایده' : 'New Idea',
              desc: isRtl ? 'تولید ۱۰ ایده جدید' : 'Generate ideas',
              icon: Lightbulb,
              color: 'text-amber-400',
              bg: 'bg-amber-500/10 border-amber-500/20',
            },
            {
              id: 'reel-studio',
              title: isRtl ? 'ساخت Reel' : 'Create Reel',
              desc: isRtl ? 'بلپرینت ویدیویی ۹:۱۶' : '9:16 Video blueprint',
              icon: Video,
              color: 'text-rose-400',
              bg: 'bg-rose-500/10 border-rose-500/20',
            },
            {
              id: 'carousel-studio',
              title: isRtl ? 'ساخت Carousel' : 'Create Carousel',
              desc: isRtl ? 'اسلایدهای ورق‌زدنی' : 'Slide-by-slide copy',
              icon: Layers,
              color: 'text-indigo-400',
              bg: 'bg-indigo-500/10 border-indigo-500/20',
            },
            {
              id: 'story-studio',
              title: isRtl ? 'ساخت Story' : 'Create Story',
              desc: isRtl ? 'رشته استوری تعاملی' : 'Engagement sequences',
              icon: Flame,
              color: 'text-orange-400',
              bg: 'bg-orange-500/10 border-orange-500/20',
            },
            {
              id: 'calendar',
              title: isRtl ? 'مشاهده تقویم' : 'Calendar',
              desc: isRtl ? 'برنامه‌ریزی انتشار' : 'Schedule manager',
              icon: CalendarIcon,
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10 border-emerald-500/20',
            },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => setCurrentView(action.id)}
                className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer glass-card-hover ${action.bg}`}
              >
                <Icon className={`w-5 h-5 ${action.color} mb-2`} />
                <div className="text-xs font-bold text-white">{action.title}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{action.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Content Pipeline Stages (Kanban preview counters) */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Kanban className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-bold text-white">
              {isRtl ? 'پایپ‌لاین جریان تولید محتوا (Content Pipeline)' : 'Content Pipeline'}
            </h4>
          </div>
          <button
            onClick={() => setCurrentView('pipeline')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>{isRtl ? 'مدیریت در کانبان' : 'Open Kanban'}</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
          {[
            { label: isRtl ? 'ایده‌ها' : 'Ideas', count: stageCounts.idea, color: 'text-amber-400' },
            { label: isRtl ? 'سناریو' : 'Scenario', count: stageCounts.scenario, color: 'text-indigo-400' },
            { label: isRtl ? 'تولید/ضبط' : 'Production', count: stageCounts.production, color: 'text-rose-400' },
            { label: isRtl ? 'آماده تأیید' : 'Ready', count: stageCounts.ready, color: 'text-cyan-400' },
            { label: isRtl ? 'زمان‌بندی‌شده' : 'Scheduled', count: stageCounts.scheduled, color: 'text-purple-400' },
            { label: isRtl ? 'منتشر شده' : 'Published', count: stageCounts.published, color: 'text-emerald-400' },
          ].map((st, i) => (
            <div key={i} className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-center">
              <div className={`text-xl font-black ${st.color}`}>{st.count}</div>
              <div className="text-[11px] font-medium text-slate-400 mt-0.5">{st.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Upcoming Content & AI Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Content */}
        <div className="glass-panel rounded-2xl p-5 border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white">
                  {isRtl ? 'محتواهای پیش‌رو' : 'Upcoming Content'}
                </h4>
              </div>
              <button
                onClick={() => setCurrentView('calendar')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
              >
                {isRtl ? 'مشاهده همه' : 'View all'}
              </button>
            </div>

            <div className="space-y-2.5">
              {todayContent.length === 0 && tomorrowContent.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  {isRtl
                    ? 'برای امروز یا فردا محتوایی برنامه‌ریزی نشده است.'
                    : 'No content scheduled for today or tomorrow.'}
                </div>
              ) : (
                <>
                  {todayContent.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setActiveContentId(c.id);
                        setCurrentView(
                          c.contentType === 'reel'
                            ? 'reel-studio'
                            : c.contentType === 'carousel'
                            ? 'carousel-studio'
                            : 'scenario-studio'
                        );
                      }}
                      className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30 hover:border-emerald-500/60 cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                          {isRtl ? 'امروز' : 'Today'} • {c.scheduledTime || '19:30'}
                        </span>
                        <div className="text-xs font-semibold text-slate-200 truncate max-w-[200px]">
                          {c.title}
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">{c.contentType}</span>
                    </div>
                  ))}

                  {tomorrowContent.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setActiveContentId(c.id);
                        setCurrentView(
                          c.contentType === 'reel'
                            ? 'reel-studio'
                            : c.contentType === 'carousel'
                            ? 'carousel-studio'
                            : 'scenario-studio'
                        );
                      }}
                      className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {isRtl ? 'فردا' : 'Tomorrow'} • {c.scheduledTime || '20:00'}
                        </span>
                        <div className="text-xs font-semibold text-slate-200 truncate max-w-[200px]">
                          {c.title}
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">{c.contentType}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
            <span>
              {upcomingThisWeek.length} {isRtl ? 'محتوا برای روزهای آینده این هفته' : 'items scheduled later this week'}
            </span>
          </div>
        </div>

        {/* AI Smart Suggestions */}
        <div className="glass-panel rounded-2xl p-5 border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-white">
                  {isRtl ? 'پیشنهادهای هوش مصنوعی امروز' : 'AI Suggestions Today'}
                </h4>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/20 hover:border-amber-500/40 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300">
                    {isRtl ? 'ایده پیشنهادی امروز' : 'Today Idea'}
                  </span>
                  <span className="text-[10px] text-slate-400">Reel • 30s</span>
                </div>
                <div className="text-xs font-bold text-slate-200">
                  ۳ تکنیک افزایش اعتماد در فروش اینستاگرامی
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  طبق حافظه برند، این موضوع هم با دغدغه مخاطبان شما هماهنگ است و هم محصول اصلی‌تان را معرفی می‌کند.
                </p>
                <div className="mt-2 text-right">
                  <button
                    onClick={() => {
                      setQuickInput('یک ریلز ۳۰ ثانیه‌ای درباره ۳ تکنیک افزایش اعتماد در فروش اینستاگرامی بنویس');
                      handleQuickCreate('یک ریلز ۳۰ ثانیه‌ای درباره ۳ تکنیک افزایش اعتماد در فروش اینستاگرامی بنویس');
                    }}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                  >
                    {isRtl ? 'ساخت این ریلز با AI ←' : 'Create this Reel ←'}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300">
                    {isRtl ? 'تکمیل پیش‌نویس' : 'Draft action'}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-200">
                  {ideas.length > 0 ? ideas[0].title : 'ایده‌های خام در انتظار سناریونویسی'}
                </div>
                <div className="mt-2 text-right">
                  <button
                    onClick={() => setCurrentView('ideas')}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                  >
                    {isRtl ? 'مشاهده و تبدیل ایده‌ها ←' : 'Convert Ideas ←'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
