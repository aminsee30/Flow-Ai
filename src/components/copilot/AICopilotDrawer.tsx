import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Paperclip,
  Trash2,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { callGeminiChat, callGeminiImageAnalysis, buildBrandContextPrompt } from '../../lib/gemini';

export const AICopilotDrawer: React.FC = () => {
  const {
    isCopilotOpen,
    setIsCopilotOpen,
    copilotMessages,
    addCopilotMessage,
    clearCopilotChat,
    workspace,
    currentView,
    activeContent,
    convertIdeaToContent,
    addIdea,
    lang,
  } = useApp();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isRtl = lang === 'fa';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isCopilotOpen) {
      scrollToBottom();
    }
  }, [copilotMessages, isCopilotOpen]);

  const quickPrompts = [
    '۵ ایده وایرال برای هفته آینده پیشنهاد بده',
    'قلاب این محتوا را جذاب‌تر و متوقف‌کننده اسکرول کن',
    'برای این پست یک رشته استوری ۵ تایی مکمل بساز',
    'چطور این سناریو را به فروش مستقیم تبدیل کنم؟',
    '۳ زاویه دید متفاوت برای معرفی محصول اصلی ما بده',
  ];

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input.trim();
    if (!textToSend && !selectedImage) return;

    setInput('');
    addCopilotMessage('user', textToSend || 'تحلیل تصویر پیوست شده');
    setLoading(true);

    try {
      if (selectedImage) {
        // Image analysis mode
        const analysisPrompt = textToSend || 'این تصویر / اسکرین‌شات محتوایی را تحلیل کن و زوایای هوک، فرمت و ایده بازتولید آن را استخراج کن.';
        const responseText = await callGeminiImageAnalysis(selectedImage, analysisPrompt);
        addCopilotMessage('assistant', responseText);
        setSelectedImage(null);
      } else {
        // Multi-turn chat with context
        const brandSystem = buildBrandContextPrompt(workspace);
        const currentContextInfo = `
[CURRENT APP CONTEXT]
Active Screen: ${currentView}
Active Content Title: ${activeContent ? activeContent.title : 'None selected'}
Active Content Type: ${activeContent ? activeContent.contentType : 'None'}
Active Content Hook: ${activeContent ? activeContent.hook : 'None'}
Active Scenario Text: ${activeContent ? activeContent.scenarioText : 'None'}
`.trim();

        const fullSystemInstruction = `${brandSystem}\n\n${currentContextInfo}\n\nAlways provide direct, practical, ready-to-execute advice in ${workspace?.brandProfile.contentLanguage || 'Persian'}.`;

        const chatHistory = copilotMessages
          .filter((m) => m.id !== 'welcome')
          .map((m) => ({ role: m.role, content: m.content }));

        chatHistory.push({ role: 'user', content: textToSend });

        const answer = await callGeminiChat(chatHistory, fullSystemInstruction, 'gemini-3.5-flash');
        addCopilotMessage('assistant', answer);
      }
    } catch (err: any) {
      addCopilotMessage(
        'assistant',
        `متاسفانه خطایی رخ داد: ${err.message || 'خطا در ارتباط با هوش مصنوعی'}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isCopilotOpen) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        onClick={() => setIsCopilotOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 sm:hidden"
        aria-label="Close Copilot"
      />

      <div
        className={`fixed inset-y-0 ${
          isRtl ? 'left-0 sm:left-0' : 'right-0 sm:right-0'
        } w-full sm:w-[420px] max-w-full bg-slate-950/95 backdrop-blur-xl ${
          isRtl ? 'border-r' : 'border-l'
        } border-slate-800 shadow-2xl z-50 flex flex-col animate-in ${
          isRtl ? 'slide-in-from-left' : 'slide-in-from-right'
        } duration-300`}
      >
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-indigo-600 p-0.5">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <Bot className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Flow AI Copilot</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-[10px] text-slate-400">
              {activeContent ? `همراه با زمینه: "${activeContent.title.substring(0, 20)}..."` : 'متصل به حافظه برند'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={clearCopilotChat}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
            title="پاک کردن گفتگو"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsCopilotOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="p-2 border-b border-slate-800/80 bg-slate-900/30 overflow-x-auto flex gap-1.5 scrollbar-none">
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={loading}
            className="text-[10px] whitespace-nowrap bg-slate-800/80 hover:bg-indigo-600/30 hover:border-indigo-500/40 text-slate-300 hover:text-white px-2.5 py-1 rounded-full border border-slate-700/60 transition-all cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {copilotMessages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isUser ? 'justify-start' : 'justify-start'}`}
            >
              <div
                className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                  isUser
                    ? 'bg-indigo-600 text-white'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              <div
                className={`flex-1 rounded-xl p-3 text-xs leading-relaxed max-w-[85%] ${
                  isUser
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 border border-slate-800 text-slate-200'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {!isUser && (
                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{msg.timestamp}</span>
                    <button
                      onClick={() => copyToClipboard(msg.id, msg.content)}
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">کپی شد</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>کپی پاسخ</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            <span>هوش مصنوعی در حال تفکر و پردازش...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Attached Image Preview */}
      {selectedImage && (
        <div className="p-2 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={selectedImage} alt="Ref" className="w-10 h-10 object-cover rounded-md border border-slate-700" />
            <span className="text-[11px] text-slate-300">تصویر برای تحلیل پیوست شد</span>
          </div>
          <button
            onClick={() => setSelectedImage(null)}
            className="p-1 text-slate-400 hover:text-rose-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input Box */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/90">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="پیوست اسکرین‌شات یا تصویر الهام‌بخش"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isRtl ? 'درخواستی دارید؟ مثلا: قلاب این ریلز را جذاب‌تر کن...' : 'Ask Copilot anything...'
            }
            className="flex-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading || (!input.trim() && !selectedImage)}
            className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-colors cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
    </>
  );
};
