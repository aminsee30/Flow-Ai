import React, { useState } from 'react';
import {
  Settings,
  User,
  ShieldCheck,
  BrainCircuit,
  Sliders,
  Save,
  CheckCircle2,
  Database,
  LogIn,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const {
    user,
    signInWithGoogle,
    signOut,
    workspace,
    updateWorkspace,
    lang,
    setLang,
  } = useApp();

  const isRtl = lang === 'fa';

  const [workspaceName, setWorkspaceName] = useState(workspace?.name || 'فضای کاری من');
  const [defaultTone, setDefaultTone] = useState(workspace?.brandVoice || 'صمیمی (Friendly & Casual)');
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await updateWorkspace({
      name: workspaceName,
      brandVoice: defaultTone,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-3 sm:p-6 max-w-5xl mx-auto space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-400" />
            <span>{isRtl ? 'تنظیمات سیستم و حساب کاربری' : 'System Settings'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isRtl
              ? 'مدیریت حساب، همگام‌سازی ابری با Firebase، اولویت‌های زبانی و تنظیمات هوش مصنوعی'
              : 'User profile, Firebase cloud persistence, and AI model parameters.'}
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isRtl ? 'ذخیره تنظیمات' : 'Save Settings'}</span>
        </button>
      </div>

      {saved && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>تنظیمات با موفقیت ذخیره شد.</span>
        </div>
      )}

      {/* Account & Cloud Sync Status */}
      <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-white border-b border-slate-800 pb-2">
          <User className="w-4 h-4 text-indigo-400" />
          <span>{isRtl ? 'وضعیت حساب و احراز هویت (Firebase Auth)' : 'Account & Cloud Persistence'}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-3">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Avatar"
                className="w-12 h-12 rounded-full border border-indigo-500/50"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 flex items-center justify-center font-bold text-sm">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div>
              <div className="text-sm font-bold text-white">
                {user ? user.displayName || user.email : 'کاربر مهمان / محلی (Guest)'}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {user ? user.email : 'برای ذخیره‌سازی ابری چنددستگاهی وارد حساب گوگل شوید.'}
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <Database className="w-3 h-3" />
                  <span>دیتابیس ابری Firestore متصل است</span>
                </span>
              </div>
            </div>
          </div>

          <div>
            {user ? (
              <button
                onClick={signOut}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{isRtl ? 'خروج از حساب' : 'Sign Out'}</span>
              </button>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>{isRtl ? 'اتصال با حساب گوگل' : 'Sign In with Google'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Workspace Settings */}
      <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-white border-b border-slate-800 pb-2">
          <Sliders className="w-4 h-4 text-amber-400" />
          <span>{isRtl ? 'مشخصات فضای کاری (Workspace)' : 'Workspace Details'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              نام فضای کاری (Workspace Name)
            </label>
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              لحن پیش‌فرض هوش مصنوعی
            </label>
            <input
              type="text"
              value={defaultTone}
              onChange={(e) => setDefaultTone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              جهت و زبان رابط کاربری
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLang('fa')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                  lang === 'fa'
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                فارسی (RTL)
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                  lang === 'en'
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                English (LTR)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Models Architecture Info */}
      <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 border-b border-slate-800 pb-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{isRtl ? 'معماری و مدل‌های هوش مصنوعی فعال' : 'AI Models Engine'}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-indigo-400 font-bold font-mono">gemini-3.1-pro-preview</span>
            <p className="text-[11px] text-slate-400">
              برای وظایف پیچیده: نگارش سناریوهای عمیق، کاروسل چند اسلایدی و تحلیل هوشمند عکس
            </p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-emerald-400 font-bold font-mono">gemini-3.5-flash</span>
            <p className="text-[11px] text-slate-400">
              برای وظایف عمومی: دستیار هوشمند Copilot، برنامه‌ریز هفتگی و استودیو ریلز
            </p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-amber-400 font-bold font-mono">gemini-3.1-flash-lite</span>
            <p className="text-[11px] text-slate-400">
              برای پاسخ‌های با تأخیر کم و سریع: بازنویسی‌های لحظه‌ای، هوک‌های سریع، کپشن و هشتگ‌ها
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
