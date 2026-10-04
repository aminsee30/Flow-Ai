import React, { useState } from 'react';
import {
  Bell,
  Sparkles,
  LogIn,
  LogOut,
  Globe,
  Plus,
  Search,
  CheckCircle,
  Clock,
  Lightbulb,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    user,
    signInWithGoogle,
    signOut,
    notifications,
    markNotificationRead,
    currentView,
    setCurrentView,
    lang,
    setLang,
    setIsCopilotOpen,
    isCopilotOpen,
    toggleSidebar,
    isSidebarCollapsed,
    toggleSidebarCollapsed,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const isRtl = lang === 'fa';

  const viewTitles: Record<string, string> = {
    dashboard: isRtl ? 'داشبورد هوشمند' : 'Dashboard',
    ideas: isRtl ? 'استودیوی ایده‌ها' : 'Idea Studio',
    'scenario-studio': isRtl ? 'سناریونویس جامع' : 'Scenario Studio',
    'reel-studio': isRtl ? 'استودیو ساخت ریلز (Blueprint)' : 'Reel Studio',
    'carousel-studio': isRtl ? 'استودیو کاروسل اینستاگرام' : 'Carousel Studio',
    'story-studio': isRtl ? 'استودیو طراحی استوری' : 'Story Studio',
    pipeline: isRtl ? 'پایپ‌لاین مدیریت محتوا (Kanban)' : 'Content Pipeline',
    calendar: isRtl ? 'تقویم انتشار و برنامه‌ریز هوشمند' : 'Content Calendar',
    'all-content': isRtl ? 'تمام محتواهای تولید شده' : 'Content Library',
    'brand-memory': isRtl ? 'هسته حافظه برند (Brand Memory)' : 'Brand Memory',
    products: isRtl ? 'کاتالوگ محصولات و خدمات' : 'Products & Services',
    audience: isRtl ? 'شناخت پرسونای مخاطب' : 'Target Audience',
    settings: isRtl ? 'تنظیمات سیستم و پرومپت‌ها' : 'Settings',
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 shrink-0">
      {/* Breadcrumb / Title with Mobile Menu Toggle */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
          title={isRtl ? 'باز کردن منو' : 'Toggle Menu'}
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5 text-indigo-400" />
        </button>

        {/* Desktop Collapse Toggle Button */}
        <button
          onClick={toggleSidebarCollapsed}
          className="hidden lg:flex p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800/80 transition-colors shrink-0 cursor-pointer"
          title={isSidebarCollapsed ? (isRtl ? 'گسترش سایدبار' : 'Expand Sidebar') : (isRtl ? 'مخفی کردن سایدبار' : 'Collapse Sidebar')}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="w-4 h-4 text-indigo-400" />
          ) : (
            <PanelLeftClose className="w-4 h-4 text-slate-400" />
          )}
        </button>

        <h1 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
          {viewTitles[currentView] || 'Flow AI'}
        </h1>
        <span className="hidden xl:inline-block w-1.5 h-1.5 rounded-full bg-slate-700" />
        <span className="hidden xl:inline-block text-xs text-slate-400 truncate max-w-xs">
          {isRtl ? 'سیستم عامل تولید و انتشار محتوا با هوش مصنوعی' : 'Autonomous AI Content OS'}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Quick New Idea button */}
        <button
          onClick={() => setCurrentView('ideas')}
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isRtl ? 'تولید محتوای جدید' : 'New Content'}</span>
          <span className="sm:hidden">{isRtl ? 'جدید' : 'New'}</span>
        </button>

        {/* Global Copilot quick button */}
        <button
          onClick={() => setIsCopilotOpen(!isCopilotOpen)}
          className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all shrink-0 cursor-pointer ${
            isCopilotOpen
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
          title="AI Copilot"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">Copilot</span>
        </button>

        {/* Language switch */}
        <button
          onClick={() => setLang(lang === 'fa' ? 'en' : 'fa')}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium shrink-0 cursor-pointer"
          title="Switch Language"
        >
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span>{lang === 'fa' ? 'FA' : 'EN'}</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white relative transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className={`absolute ${isRtl ? 'left-0 sm:left-auto sm:left-0' : 'right-0'} mt-2 w-72 sm:w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white">
                  {isRtl ? 'اعلان‌ها و یادآورها' : 'Notifications'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {unreadCount} {isRtl ? 'خوانده‌نشده' : 'unread'}
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/60 mt-1">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500">
                    {isRtl ? 'اعلانی وجود ندارد' : 'No notifications'}
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-2.5 hover:bg-slate-800/50 rounded-lg cursor-pointer transition-colors ${
                        !n.read ? 'bg-indigo-950/20' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {n.type === 'scheduled' ? (
                          <Clock className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                        ) : (
                          <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-white leading-snug">
                            {n.title}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
                            {n.message}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Auth */}
        {user ? (
          <div className="flex items-center gap-2">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="Avatar"
                className="w-7 h-7 rounded-full border border-indigo-500/40"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 flex items-center justify-center font-bold text-xs">
                {user.email?.charAt(0).toUpperCase()}
              </div>
            )}
            <button
              onClick={signOut}
              className="hidden md:flex p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={signInWithGoogle}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer shrink-0"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{isRtl ? 'ورود با گوگل' : 'Sign In'}</span>
          </button>
        )}
      </div>
    </header>
  );
};
