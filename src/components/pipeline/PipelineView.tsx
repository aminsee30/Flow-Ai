import React from 'react';
import {
  Kanban,
  Video,
  Layers,
  Flame,
  FileText,
  Clock,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ContentItem, ContentStage } from '../../types';

export const PipelineView: React.FC = () => {
  const {
    contents,
    ideas,
    updateContent,
    setActiveContentId,
    setCurrentView,
    convertIdeaToContent,
    lang,
  } = useApp();

  const isRtl = lang === 'fa';

  const stages: { id: ContentStage; title: string; color: string; desc: string }[] = [
    { id: 'idea', title: isRtl ? 'ایده‌ها' : 'Ideas', color: 'border-amber-500/40 text-amber-400', desc: 'ایده‌های خام در صف سناریو' },
    { id: 'scenario', title: isRtl ? 'سناریونویسی' : 'Scenario', color: 'border-indigo-500/40 text-indigo-400', desc: 'نگارش هوک و متن کامل' },
    { id: 'production', title: isRtl ? 'تولید و ضبط' : 'Production', color: 'border-rose-500/40 text-rose-400', desc: 'فیلم‌برداری یا طراحی گرافیک' },
    { id: 'ready', title: isRtl ? 'آماده تأیید' : 'Ready / Approved', color: 'border-cyan-500/40 text-cyan-400', desc: 'آماده انتشار نهایی' },
    { id: 'scheduled', title: isRtl ? 'زمان‌بندی‌شده' : 'Scheduled', color: 'border-purple-500/40 text-purple-400', desc: 'دارای تاریخ و ساعت تقویم' },
    { id: 'published', title: isRtl ? 'منتشر شده' : 'Published', color: 'border-emerald-500/40 text-emerald-400', desc: 'منتشر شده در شبکه اجتماعی' },
  ];

  const handleStageChange = async (item: ContentItem, nextStage: ContentStage) => {
    await updateContent(item.id, {
      stage: nextStage,
      status: nextStage === 'published' ? 'published' : nextStage === 'scheduled' ? 'scheduled' : 'in_progress',
    });
  };

  const openContentInStudio = (item: ContentItem) => {
    setActiveContentId(item.id);
    if (item.contentType === 'reel') {
      setCurrentView('reel-studio');
    } else if (item.contentType === 'carousel') {
      setCurrentView('carousel-studio');
    } else if (item.contentType === 'story') {
      setCurrentView('story-studio');
    } else {
      setCurrentView('scenario-studio');
    }
  };

  const getFormatIcon = (type: string) => {
    switch (type) {
      case 'reel':
        return <Video className="w-3 h-3 text-rose-400" />;
      case 'carousel':
        return <Layers className="w-3 h-3 text-indigo-400" />;
      case 'story':
        return <Flame className="w-3 h-3 text-orange-400" />;
      default:
        return <FileText className="w-3 h-3 text-slate-400" />;
    }
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Kanban className="w-5 h-5 text-indigo-400" />
            <span>{isRtl ? 'پایپ‌لاین مدیریت جریان تولید (Content Pipeline)' : 'Content Pipeline'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isRtl
              ? 'ردیابی و مدیریت مسیر محتوا از ایده اولیه تا سناریو، تولید، تأیید، زمان‌بندی و انتشار'
              : 'End-to-end kanban workflow: Idea → Scenario → Production → Ready → Scheduled → Published'}
          </p>
        </div>

        <button
          onClick={() => setCurrentView('calendar')}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span>{isRtl ? 'مشاهده در تقویم' : 'Calendar View'}</span>
        </button>
      </div>

      {/* Kanban Board Container */}
      <div className="overflow-x-auto pb-6">
        <div className="flex gap-4 min-w-[1200px]">
          {stages.map((stage, sIdx) => {
            // For stage 'idea', we can show both unscheduled ideas and items with stage='idea'
            const stageContents = contents.filter((c) => c.stage === stage.id);
            const totalCount = stage.id === 'idea' ? ideas.length : stageContents.length;

            return (
              <div
                key={stage.id}
                className="w-72 bg-slate-950/70 border border-slate-800/80 rounded-2xl flex flex-col max-h-[75vh]"
              >
                {/* Column Header */}
                <div className={`p-3.5 border-b border-slate-800/80 border-t-2 ${stage.color} bg-slate-900/40 rounded-t-2xl`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{stage.title}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                      {totalCount}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 truncate">{stage.desc}</div>
                </div>

                {/* Column Cards */}
                <div className="p-3 overflow-y-auto flex-1 space-y-3">
                  {stage.id === 'idea' ? (
                    // Display Ideas in column 1
                    ideas.length === 0 ? (
                      <div className="py-8 text-center text-[11px] text-slate-600">
                        ایده‌ای در این مرحله نیست
                      </div>
                    ) : (
                      ideas.map((idea) => (
                        <div
                          key={idea.id}
                          className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/90 hover:border-amber-500/40 transition-all space-y-2 group shadow-sm"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 uppercase">
                              {idea.contentType}
                            </span>
                            <span className="text-[10px] text-slate-400">{idea.contentPillar}</span>
                          </div>

                          <h4 className="text-xs font-bold text-white leading-snug">{idea.title}</h4>
                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                            {idea.description}
                          </p>

                          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                            <button
                              onClick={() => convertIdeaToContent(idea)}
                              className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <span>انتقال به سناریو</span>
                              <ChevronLeft className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))
                    )
                  ) : stageContents.length === 0 ? (
                    <div className="py-8 text-center text-[11px] text-slate-600">
                      محتوایی در این ستون نیست
                    </div>
                  ) : (
                    stageContents.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => openContentInStudio(item)}
                        className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-2.5 cursor-pointer shadow-sm group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            {getFormatIcon(item.contentType)}
                            <span className="text-[10px] font-bold uppercase text-slate-300">
                              {item.contentType}
                            </span>
                          </div>
                          {item.scheduledDate && (
                            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                              <Clock className="w-3 h-3" />
                              <span>{item.scheduledDate.substring(5)}</span>
                            </div>
                          )}
                        </div>

                        <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                          {item.title}
                        </h4>

                        {item.hook && (
                          <p className="text-[11px] text-amber-300/80 line-clamp-1 italic">
                            «{item.hook}»
                          </p>
                        )}

                        {/* Move stage controls */}
                        <div
                          className="pt-2 border-t border-slate-800/80 flex items-center justify-between"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {sIdx > 1 ? (
                            <button
                              onClick={() => handleStageChange(item, stages[sIdx - 1].id)}
                              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                              title="انتقال به مرحله قبل"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <div />
                          )}

                          <span className="text-[10px] text-slate-400 font-semibold">
                            {stages[sIdx].title}
                          </span>

                          {sIdx < stages.length - 1 && (
                            <button
                              onClick={() => handleStageChange(item, stages[sIdx + 1].id)}
                              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                              title="انتقال به مرحله بعد"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
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
    </div>
  );
};
