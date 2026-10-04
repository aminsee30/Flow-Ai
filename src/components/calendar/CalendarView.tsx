import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Clock,
  Video,
  Layers,
  Flame,
  FileText,
  Plus,
  CheckCircle2,
  Loader2,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateAIWeeklyPlanner } from '../../lib/aiActions';
import { ContentItem } from '../../types';

export const CalendarView: React.FC = () => {
  const {
    workspace,
    contents,
    addContent,
    updateContent,
    setActiveContentId,
    setCurrentView,
    lang,
  } = useApp();

  const isRtl = lang === 'fa';

  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [weeklyPlanProposal, setWeeklyPlanProposal] = useState<any[] | null>(null);
  const [acceptedNotice, setAcceptedNotice] = useState(false);

  // Compute 7 days for the weekly view
  const getDaysOfWeek = () => {
    const days = [];
    const baseDate = new Date();
    // find recent Saturday or today
    for (let i = 0; i < 7; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayNamesFa = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];
      const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      days.push({
        date: iso,
        dayName: isRtl ? dayNamesFa[d.getDay()] : dayNamesEn[d.getDay()],
        dayNumber: d.getDate(),
        isToday: i === 0,
      });
    }
    return days;
  };

  const weekDays = getDaysOfWeek();

  const handleGenerateWeeklyPlan = async () => {
    setIsGeneratingPlan(true);
    setWeeklyPlanProposal(null);
    try {
      const plan = await generateAIWeeklyPlanner(workspace, weekDays[0].date);
      setWeeklyPlanProposal(plan);
    } catch (err) {
      console.error('Weekly plan error:', err);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleAcceptPlan = async () => {
    if (!weeklyPlanProposal) return;

    for (let i = 0; i < weeklyPlanProposal.length; i++) {
      const p = weeklyPlanProposal[i];
      const targetDate = weekDays[i % weekDays.length].date;

      await addContent({
        title: p.title,
        contentType: p.contentType || 'reel',
        stage: 'scheduled',
        status: 'scheduled',
        scheduledDate: targetDate,
        scheduledTime: p.suggestedTime || '19:30',
        hook: p.title,
        hooks: [p.title],
        scenarioText: p.brief || p.title,
        caption: `${p.title}\n\n${p.brief || ''}\n\n📌 ذخیره کنید برای بعد!`,
        hashtags: ['برنامه_هفتگی', 'تولید_محتوا', p.contentType],
        cta: 'نظرت رو توی کامنت‌ها بگو!',
      });
    }

    setWeeklyPlanProposal(null);
    setAcceptedNotice(true);
    setTimeout(() => setAcceptedNotice(false), 3000);
  };

  const getFormatIcon = (type: string) => {
    switch (type) {
      case 'reel':
        return <Video className="w-3.5 h-3.5 text-rose-400" />;
      case 'carousel':
        return <Layers className="w-3.5 h-3.5 text-indigo-400" />;
      case 'story':
        return <Flame className="w-3.5 h-3.5 text-orange-400" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-emerald-400" />
            <span>{isRtl ? 'تقویم هوشمند محتوا (Content Calendar)' : 'Smart Content Calendar'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isRtl
              ? 'برنامه‌ریزی دقیق، انتشار منظم و برنامه‌ریز هوش مصنوعی ۷ روزه'
              : 'Interactive scheduling with 1-click AI Weekly Content Planner.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* AI Weekly Planner Button */}
          <button
            onClick={handleGenerateWeeklyPlan}
            disabled={isGeneratingPlan}
            className="w-full sm:w-auto justify-center px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
          >
            {isGeneratingPlan ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isRtl ? 'در حال طراحی برنامه هفته...' : 'Planning week...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isRtl ? 'برنامه‌ریز هفتگی هوش مصنوعی' : 'AI Weekly Planner'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success alert */}
      {acceptedNotice && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>برنامه هفتگی با موفقیت تأیید و وارد تقویم و پایپ‌لاین انتشار شد!</span>
        </div>
      )}

      {/* AI Weekly Planner Proposal Preview */}
      {weeklyPlanProposal && (
        <div className="glass-panel rounded-2xl p-4 sm:p-6 border-emerald-500/40 space-y-4 animate-in fade-in slide-in-from-top-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  {isRtl ? 'پیشنهاد هوش مصنوعی برای برنامه هفته آینده' : 'AI 7-Day Strategy Proposal'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isRtl
                    ? 'یک استراتژی پیوسته و هدفمند برای رشد تعامل و فروش بر اساس حافظه برند شما'
                    : 'Balanced mix of Reels, Carousels, and Story sequences tailored to your audience.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setWeeklyPlanProposal(null)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                انصراف
              </button>
              <button
                onClick={handleAcceptPlan}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{isRtl ? 'تأیید و ثبت در تقویم' : 'Accept & Add to Calendar'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
            {weeklyPlanProposal.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-indigo-400">{item.dayName}</span>
                    <span className="text-[10px] font-mono text-slate-500">{item.suggestedTime}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    {getFormatIcon(item.contentType)}
                    <span className="text-[10px] font-bold uppercase text-slate-300">
                      {item.contentType}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-3">
                    {item.brief}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-900 text-[10px] text-amber-400 font-medium">
                  {item.pillar}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Calendar Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
        {weekDays.map((day) => {
          const dayContents = contents.filter((c) => c.scheduledDate === day.date);

          return (
            <div
              key={day.date}
              className={`rounded-2xl border flex flex-col min-h-[220px] sm:min-h-[380px] transition-all ${
                day.isToday
                  ? 'bg-slate-950 border-indigo-500/60 shadow-lg shadow-indigo-500/5'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Day Header */}
              <div
                className={`p-3.5 border-b border-slate-800/80 flex items-center justify-between rounded-t-2xl ${
                  day.isToday ? 'bg-indigo-950/30' : 'bg-slate-900/30'
                }`}
              >
                <div>
                  <div className={`text-xs font-bold ${day.isToday ? 'text-indigo-400' : 'text-slate-300'}`}>
                    {day.dayName}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">{day.date.substring(5)}</div>
                </div>

                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                    day.isToday
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  {day.dayNumber}
                </div>
              </div>

              {/* Day Contents List */}
              <div className="p-2.5 flex-1 overflow-y-auto space-y-2">
                {dayContents.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center py-10 text-center">
                    <span className="text-[11px] text-slate-600">بدون برنامه</span>
                    <button
                      onClick={() => {
                        addContent({
                          title: 'محتوای برنامه‌ریزی شده',
                          contentType: 'reel',
                          stage: 'scheduled',
                          status: 'scheduled',
                          scheduledDate: day.date,
                          scheduledTime: '19:30',
                          hook: 'هوک این محتوا',
                          hooks: ['هوک این محتوا'],
                          scenarioText: '',
                          caption: '',
                          hashtags: [],
                          cta: '',
                        });
                      }}
                      className="mt-2 p-1 text-slate-600 hover:text-indigo-400 transition-colors"
                      title="افزودن محتوا به این روز"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  dayContents.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setActiveContentId(item.id);
                        if (item.contentType === 'reel') setCurrentView('reel-studio');
                        else if (item.contentType === 'carousel') setCurrentView('carousel-studio');
                        else if (item.contentType === 'story') setCurrentView('story-studio');
                        else setCurrentView('scenario-studio');
                      }}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer space-y-1.5 group shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {getFormatIcon(item.contentType)}
                          <span className="text-[9px] font-bold uppercase text-slate-400">
                            {item.contentType}
                          </span>
                        </div>
                        <span className="text-[9px] font-mono text-emerald-400">
                          {item.scheduledTime || '19:30'}
                        </span>
                      </div>

                      <h5 className="text-[11px] font-bold text-white group-hover:text-indigo-300 leading-snug line-clamp-2">
                        {item.title}
                      </h5>

                      <div className="flex items-center justify-between text-[9px] text-slate-500 pt-1 border-t border-slate-900">
                        <span className="capitalize">{item.stage}</span>
                        {item.status === 'published' ? (
                          <span className="text-emerald-400 font-bold">منتشر شده</span>
                        ) : (
                          <span className="text-purple-400 font-bold">آماده</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
