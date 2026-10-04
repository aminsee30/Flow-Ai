import React from 'react';
import {
  Sparkles,
  LayoutDashboard,
  Lightbulb,
  FileText,
  Video,
  Layers,
  Flame,
  Kanban,
  Calendar,
  FolderOpen,
  BrainCircuit,
  Package,
  Users,
  Settings,
  Bot,
  ChevronRight,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  highlight?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    workspace,
    isCopilotOpen,
    setIsCopilotOpen,
    lang,
    isSidebarOpen,
    setIsSidebarOpen,
    isSidebarCollapsed,
    toggleSidebarCollapsed,
  } = useApp();

  const isRtl = lang === 'fa';

  const navGroups: NavGroup[] = [
    {
      title: isRtl ? 'خانه' : 'Home',
      items: [
        { id: 'dashboard', label: isRtl ? 'داشبورد' : 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: isRtl ? 'تولید محتوا' : 'Create',
      items: [
        { id: 'ideas', label: isRtl ? 'استودیوی ایده‌ها' : 'Idea Studio', icon: Lightbulb, badge: 'AI' },
        { id: 'scenario-studio', label: isRtl ? 'سناریونویس' : 'Scenario Studio', icon: FileText },
        { id: 'reel-studio', label: isRtl ? 'استودیو ریلز' : 'Reel Studio', icon: Video, badge: '9:16' },
        { id: 'carousel-studio', label: isRtl ? 'استودیو کاروسل' : 'Carousel Studio', icon: Layers, badge: 'Slides' },
        { id: 'story-studio', label: isRtl ? 'استودیو استوری' : 'Story Studio', icon: Flame },
      ],
    },
    {
      title: isRtl ? 'برنامه‌ریزی' : 'Plan',
      items: [
        { id: 'pipeline', label: isRtl ? 'پایپ‌لاین تولید' : 'Content Pipeline', icon: Kanban },
        { id: 'calendar', label: isRtl ? 'تقویم محتوا' : 'Smart Calendar', icon: Calendar, badge: 'Planner' },
      ],
    },
    {
      title: isRtl ? 'مخزن' : 'Library',
      items: [
        { id: 'all-content', label: isRtl ? 'تمام محتواها' : 'All Content', icon: FolderOpen },
      ],
    },
    {
      title: isRtl ? 'هویت برند' : 'Brand Memory',
      items: [
        { id: 'brand-memory', label: isRtl ? 'حافظه برند' : 'Brand Memory', icon: BrainCircuit, highlight: true },
        { id: 'products', label: isRtl ? 'محصولات و خدمات' : 'Products & Services', icon: Package },
        { id: 'audience', label: isRtl ? 'مخاطب هدف' : 'Target Audience', icon: Users },
      ],
    },
    {
      title: isRtl ? 'سیستم' : 'System',
      items: [
        { id: 'settings', label: isRtl ? 'تنظیمات' : 'Settings', icon: Settings },
      ],
    },
  ];

  const handleSelectNav = (viewId: string) => {
    setCurrentView(viewId);
    setIsSidebarOpen(false); // Auto close mobile drawer
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 lg:hidden transition-opacity animate-in fade-in duration-200"
          aria-label="Close mobile sidebar"
        />
      )}

      {/* Main Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 z-50 flex flex-col h-screen select-none transition-all duration-300 ease-in-out bg-slate-950/95 border-slate-800/80 backdrop-blur-xl shadow-2xl lg:shadow-none lg:static
        ${isRtl ? 'right-0 border-l' : 'left-0 border-r'}
        ${
          isSidebarOpen
            ? 'translate-x-0'
            : isRtl
            ? 'translate-x-full lg:translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }
        ${isSidebarCollapsed ? 'lg:w-20' : 'w-72 sm:w-64'}
        `}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/60 flex items-center justify-between">
          <div
            onClick={() => handleSelectNav('dashboard')}
            className={`flex items-center gap-3 cursor-pointer group ${
              isSidebarCollapsed ? 'lg:justify-center lg:w-full' : ''
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400 group-hover:text-amber-400 transition-colors" />
              </div>
            </div>
            {!isSidebarCollapsed && (
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-white">Flow AI</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    MVP
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate max-w-[125px]">
                  {workspace?.brandProfile.brandName || 'Content OS'}
                </p>
              </div>
            )}
          </div>

          {/* Mobile Drawer Close Button */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
            title="بستن منو"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop Collapse Toggle Button */}
          {!isSidebarCollapsed && (
            <button
              onClick={toggleSidebarCollapsed}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-900 transition-colors"
              title={isRtl ? 'جمع کردن سایدبار' : 'Collapse Sidebar'}
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* If Desktop Collapsed: mini expand button at top */}
        {isSidebarCollapsed && (
          <div className="hidden lg:flex justify-center py-2 border-b border-slate-800/40">
            <button
              onClick={toggleSidebarCollapsed}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              title={isRtl ? 'باز کردن سایدبار' : 'Expand Sidebar'}
            >
              <PanelLeftOpen className="w-4 h-4 text-indigo-400" />
            </button>
          </div>
        )}

        {/* Nav Groups */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-5">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {!isSidebarCollapsed && (
                <div className="px-3 text-[11px] font-semibold text-slate-400 tracking-wider">
                  {group.title}
                </div>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectNav(item.id)}
                    title={isSidebarCollapsed ? item.label : undefined}
                    className={`w-full flex items-center ${
                      isSidebarCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
                    } rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 font-bold'
                        : item.highlight
                        ? 'text-amber-300 hover:bg-amber-500/10 hover:text-amber-200'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive
                            ? 'text-white'
                            : item.highlight
                            ? 'text-amber-400'
                            : 'text-slate-400 group-hover:text-white'
                        }`}
                      />
                      {!isSidebarCollapsed && <span>{item.label}</span>}
                    </div>
                    {!isSidebarCollapsed && item.badge && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* AI Copilot Quick Launcher */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
          <button
            onClick={() => {
              setIsCopilotOpen(!isCopilotOpen);
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center ${
              isSidebarCollapsed ? 'justify-center p-2' : 'justify-between p-2.5'
            } rounded-xl border transition-all cursor-pointer ${
              isCopilotOpen
                ? 'bg-gradient-to-r from-indigo-900/60 to-violet-900/60 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                : 'bg-slate-900/70 border-slate-800 hover:border-indigo-500/30 text-slate-300'
            }`}
            title="AI Copilot"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              {!isSidebarCollapsed && (
                <div className="text-right">
                  <div className="text-xs font-semibold text-white">AI Copilot</div>
                  <div className="text-[10px] text-slate-400">
                    {isRtl ? 'دستیار هوشمند پیج' : 'Live Content Assistant'}
                  </div>
                </div>
              )}
            </div>
            {!isSidebarCollapsed && (
              <ChevronRight
                className={`w-4 h-4 text-slate-500 transition-transform ${
                  isCopilotOpen ? 'rotate-90 text-indigo-400' : ''
                }`}
              />
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
