import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  Workspace,
  Idea,
  ContentItem,
  AIChatMessage,
  AppNotification,
  ContentType,
  ContentStage,
  ContentStatus,
  ProductService,
} from '../types';

interface AppContextType {
  user: User | null;
  authLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;

  // Navigation & View
  currentView: string;
  setCurrentView: (view: string) => void;
  lang: 'fa' | 'en';
  setLang: (lang: 'fa' | 'en') => void;

  // Workspace & Brand Memory
  workspace: Workspace | null;
  updateWorkspace: (updates: Partial<Workspace>) => Promise<void>;
  saveProduct: (product: ProductService) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;

  // Ideas
  ideas: Idea[];
  addIdea: (idea: Omit<Idea, 'id' | 'userId' | 'createdAt' | 'workspaceId'>) => Promise<string>;
  updateIdea: (id: string, updates: Partial<Idea>) => Promise<void>;
  deleteIdea: (id: string) => Promise<void>;
  convertIdeaToContent: (idea: Idea, targetType?: ContentType) => Promise<string>;

  // Content Items (Scenario, Reel, Carousel, Story)
  contents: ContentItem[];
  activeContentId: string | null;
  setActiveContentId: (id: string | null) => void;
  activeContent: ContentItem | null;
  addContent: (item: Omit<ContentItem, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'workspaceId'>) => Promise<string>;
  updateContent: (id: string, updates: Partial<ContentItem>) => Promise<void>;
  deleteContent: (id: string) => Promise<void>;
  duplicateContent: (id: string) => Promise<string>;

  // Global AI Copilot
  isCopilotOpen: boolean;
  setIsCopilotOpen: (open: boolean) => void;
  copilotMessages: AIChatMessage[];
  addCopilotMessage: (role: 'user' | 'assistant', content: string, appliedAction?: string) => void;
  clearCopilotChat: () => void;

  // Sidebar (Mobile Drawer & Desktop Collapse)
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_WORKSPACE: Workspace = {
  id: 'default-workspace',
  userId: 'demo-user',
  name: 'فضای کاری اصلی من',
  brandProfile: {
    brandName: 'فلو دیجیتال (Flow Digital)',
    industry: 'آموزش و آژانس بازاریابی آنلاین',
    businessDescription: 'ارائه آموزش‌های عملی رشد کسب‌وکار در اینستاگرام و خدمات تخصصی طراحی وب‌سایت و سئو.',
    mainGoal: 'افزایش تعامل، جذب لید هدفمند و فروش دوره‌ها و خدمات',
    primaryPlatform: 'Instagram',
    contentLanguage: 'فارسی (Persian)',
  },
  targetAudience: {
    who: 'صاحبان کسب‌وکارهای آنلاین، فریلنسرها و تولیدکنندگان محتوا بین ۲۰ تا ۳۸ سال',
    needs: 'رشد سریع پیج، سناریونویسی روان، افزایش فروش بدون صرف هزینه‌های گزاف تبلیغات',
    painPoints: 'نداشتن وقت برای سناریونویسی، بی‌نتیجه ماندن ریلزها، ناتوانی در فروش محصولات در استوری',
    interests: 'ابزارهای هوش مصنوعی، ترفندهای جذب فالوور، افزایش فروش و رشد شخصی',
    familiarityLevel: 'متوسط (Intermediate)',
    buyingReasons: 'ارائه آموزش گام‌به‌گام و کاربردی، پشتیبانی سریع، رضایت مشتریان قبلی',
  },
  brandVoice: 'صمیمی (Friendly & Casual)',
  customVoiceStyle: 'انرژی بالا، شفاف، مستقیم سر اصل مطلب، رفیق‌طور ولی متخصص، بدون اصطلاحات پیچیده قلمبه سلمبه.',
  forbiddenWords: [
    'یک‌شبه پولدار شوید',
    'تضمین ۱۰۰ درصدی فالوور',
    'فقط تا امشب وقت دارید (دروغین)',
    'تکنیک جادویی مخفی',
  ],
  products: [
    {
      id: 'prod-1',
      name: 'پکیج سناریونویسی حرفه‌ای ریلز',
      description: 'آموزش جامع نوشتن هوک‌های میلیونی و ساختار ویدیوهای وایرال',
      features: '۵۰ قالب آماده هوک، چک‌لیست فیلم‌برداری، راهنمای تدوین',
      benefits: 'صرفه‌جویی در ۸۰٪ زمان سناریونویسی و ۳ برابر شدن بازدیدها',
      targetAudience: 'ادمین‌ها و مدرسان آنلاین',
      mainCta: 'برای دریافت نمونه کلمه "ریلز" را دایرکت کنید',
    },
    {
      id: 'prod-2',
      name: 'خدمات طراحی سایت اختصاصی',
      description: 'طراحی وب‌سایت‌های فروشگاهی و شرکتی سریع و مدرن',
      features: 'طراحی واکنش‌گرا، اتصال به درگاه، آموزش کار با پنل',
      benefits: 'تبدیل بازدیدکنندگان به مشتریان وفادار',
      targetAudience: 'فروشگاه‌های اینستاگرامی در حال رشد',
      mainCta: 'مشاوره رایگان طراحی سایت با ارسال کلمه "سایت"',
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const INITIAL_IDEAS: Idea[] = [
  {
    id: 'idea-1',
    workspaceId: 'default-workspace',
    userId: 'demo-user',
    title: '۳ ترفند روانی که بازدید ریلز را تا ثانیه آخر نگه می‌دارد',
    description: 'بررسی تکنیک Open Loop و ایجاد تنش بصری در ثانیه ۵ ویدیو برای کاهش اسکرول.',
    contentType: 'reel',
    contentPillar: 'آموزشی',
    category: 'آموزش ریلز',
    goal: 'جذب ویو و سیو بالا',
    status: 'ready',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'idea-2',
    workspaceId: 'default-workspace',
    userId: 'demo-user',
    title: 'چرا پیج شما نمی‌فروشد؟ (تحلیل ۵ اشتباه رایج در اسلایدها)',
    description: 'کاروسل آموزشی با تحلیل بصری اشتباهات کاور، نبود CTA مشخص، و شلوغی متن.',
    contentType: 'carousel',
    contentPillar: 'اعتمادسازی',
    category: 'استراتژی محتوا',
    goal: 'ایجاد نیاز و دریافت دایرکت',
    status: 'in_progress',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'idea-3',
    workspaceId: 'default-workspace',
    userId: 'demo-user',
    title: 'پشت صحنه سناریونویسی یک ویدیوی ۵۰۰ هزار بازدیدی',
    description: 'رشته استوری ۵ تایی شامل نظرسنجی و رونمایی از فرایند تولید قبل از ارائه آفر.',
    contentType: 'story',
    contentPillar: 'Storytelling',
    category: 'پشت صحنه',
    goal: 'افزایش نرخ ریپلای و صمیمیت',
    status: 'draft',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
];

const INITIAL_CONTENTS: ContentItem[] = [
  {
    id: 'content-1',
    workspaceId: 'default-workspace',
    userId: 'demo-user',
    ideaId: 'idea-1',
    title: '۳ ترفند روانی برای افزایش Watch Time ریلز',
    contentType: 'reel',
    stage: 'production',
    status: 'ready',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '19:30',
    hook: 'اگه ریلزت ویو نمی‌خوره، مشکل از الگوریتم نیست؛ قلاب ثانیه ۳ رو خراب کردی!',
    hooks: [
      'اگه ریلزت ویو نمی‌خوره، مشکل از الگوریتم نیست؛ قلاب ثانیه ۳ رو خراب کردی!',
      '۳ ثانیه اول ریلزت مرگ و زندگی محتواست؛ این ترفند رو تست کن!',
      'این اشتباه ساده باعث می‌شه مخاطب بعد از ۲ ثانیه ریلزت رو رد کنه!',
    ],
    scenarioText: `[00:00-00:03] هوک مستقیم: اگر ریلزت بعد از چند ساعت متوقف می‌شه، دقیقا این ۳ تا خطای ساده رو داری تکرار می‌کنی.
[00:03-00:10] اولی: استفاده از حرکت معکوس در کادر. یعنی به جای اینکه ایستا صحبت کنی، در حین ورود به کادر حرفت رو شروع کن.
[00:10-00:20] دومی: ایجاد اوپن‌لوپ در ثانیه ۵. یک سوال یا گزاره متناقض مطرح کن که جوابش در پایان ویدیو داده می‌شه.
[00:20-00:27] سومی: زیرنویس کلمه‌ای با کلمات کلیدی هایلایت‌شده با رنگ متمایز.
[00:27-00:30] CTA: این ریلز رو سیو کن که موقع سناریونویسی بعدیت حتما چکش کنی!`,
    caption: `بزرگترین اشتباهی که اکثر سازندگان محتوا مرتکب می‌شن اینه که فکر می‌کنند باید اول ویدیو سلام و احوال‌پرسی کنند! ❌
واقعیت اینه که مخاطب در کمتر از ۲ ثانیه تصمیم می‌گیره ویدیو رو ببینه یا رد کنه.

توی این ویدیو ۳ ترفند کاربردی که واچ‌تایم ریلز رو بالا می‌بره رو مرحله به مرحله گفتم.

📌 این پست رو ذخیره کن تا موقع ضبط ریلز بعدیت دم دستت باشه!
💭 کدوم ترفند برات جدیدتر بود؟ توی کامنت‌ها بگو!`,
    hashtags: ['سناریونویسی', 'تولید_محتوا', 'ریلز_اینستاگرام', 'رشد_پیج', 'الگوریتم_اینستاگرام'],
    cta: 'سیو کن تا گمش نکنی!',
    reelBlueprint: {
      duration: '30 sec',
      hook: 'اگه ریلزت ویو نمی‌خوره، مشکل از الگوریتم نیست؛ قلاب ثانیه ۳ رو خراب کردی!',
      scenario: 'سناریوی ۳ ترفند روانی ریلز',
      voiceover: 'متن صدای روایتی و کلمات پرانرژی بدون من‌من',
      onScreenText: '۳ تکنیک واچ‌تایم بالا',
      cta: 'همین الان سیو کن!',
      timecodes: [
        {
          timeRange: '00:00 - 00:03',
          title: 'هوک و کات شوک‌آور',
          description: 'نزدیک شدن سریع به دوربین با نگاه مستقیم',
          shotType: 'Talking Head',
          onScreenText: 'ویو ریلزت کمه؟ ⛔',
          voiceover: 'اگه ریلزت ویو نمی‌خوره، مشکل از الگوریتم نیست...',
        },
        {
          timeRange: '00:03 - 00:12',
          title: 'ترفند اول: حرکت در کادر',
          description: 'صحنه برداشتن ماگ یا ورق زدن دفترچه',
          shotType: 'B-Roll',
          onScreenText: 'تکنیک ۱: حرکت پویا',
          voiceover: 'اول: شروع همراه با حرکت پویا به جای ایستادن خشک',
        },
        {
          timeRange: '00:12 - 00:22',
          title: 'ترفند دوم: اوپن لوپ',
          description: 'نمایش گرافیک علامت سوال در گوشه تصویر',
          shotType: 'Talking Head',
          onScreenText: 'تکنیک ۲: Open Loop',
          voiceover: 'دوم: یک حلقه باز ذهنی در ثانیه ۵ ایجاد کن',
        },
        {
          timeRange: '00:22 - 00:30',
          title: 'ترفند سوم و دعوت به اقدام',
          description: 'اشاره دست به گوشه پایین چپ برای سیو',
          shotType: 'Talking Head',
          onScreenText: 'سیو برای ضبط بعدی 📌',
          voiceover: 'و سوم زیرنویس کلمه‌ای. سیوش کن تا یادت نره!',
        },
      ],
      shootingTips: [
        'از لنز تمیز گوشی در فاصله حدود ۱ متری با زاویه چشم استفاده کنید.',
        'نور نرم ۴۵ درجه از روبرو تا سایه زیر چشم نیفتد.',
      ],
      editingTips: [
        'سرعت برش هر ۲.۵ تا ۳ ثانیه برای حفظ انرژی مخاطب.',
        'افزودن افکت صوتی Woosh یا Pop روی متن‌های کلیدی.',
      ],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'content-2',
    workspaceId: 'default-workspace',
    userId: 'demo-user',
    ideaId: 'idea-2',
    title: 'چرا پیج شما نمی‌فروشد؟ (تحلیل ۵ اشتباه اسلایدی)',
    contentType: 'carousel',
    stage: 'ready',
    status: 'ready',
    scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    scheduledTime: '20:00',
    hook: '۵ اشتباه نابخشودنی در طراحی اسلایدهای فروش که خریدار را فراری می‌دهد!',
    hooks: [
      '۵ اشتباه نابخشودنی در اسلایدهای فروش که خریدار را فراری می‌دهد!',
      'چرا کلی ویو می‌گیری ولی هیچکس توی دایرکت خرید نمی‌کنه؟',
      'فقط یک تغییر ساده در اسلاید آخر، فروش این پست را ۳ برابر کرد!',
    ],
    scenarioText: 'کاروسل آموزشی فروش محور',
    caption: 'خیلی وقت‌ها مشکل از کیفیت محصول شما نیست، از نحوه چیدن اسلایدها و ابهام در مرحله خرید است. این ۵ نکته را ورق بزنید تا اشتباهات را رفع کنید.',
    hashtags: ['فروش_آنلاین', 'طراحی_کاروسل', 'آموزش_کسب_و_کار', 'مارکتینگ'],
    cta: 'کلمه "مشاوره" را دایرکت کنید تا پیج شما را رایگان بررسی کنیم.',
    carouselSlides: [
      {
        slideNumber: 1,
        type: 'hook',
        title: 'چرا هر چی پست می‌ذاری، خرید نمی‌کنند؟',
        body: 'اگر با وجود ویو خوب، دایرکت فروش شما سوت و کور است، اسلایدها را ورق بزنید.',
        visualSuggestion: 'پس‌زمینه تیره مات، تیتر زرد با فونت بسیار درشت و کنتراست بالا',
      },
      {
        slideNumber: 2,
        type: 'context',
        title: 'اشتباه اول: ابهام در مزیت اصلی',
        body: 'شما ویژگی‌های فنی را لیست می‌کنید، در حالی که مشتری دنبال نتیجه و حس بعد از خرید است.',
        visualSuggestion: 'مقایسه قبل و بعد (ویژگی vs فایده)',
      },
      {
        slideNumber: 3,
        type: 'content',
        title: 'اشتباه دوم: نبود اثبات اجتماعی (Social Proof)',
        body: 'هیچ اسلایدی از رضایت مشتریان قبلی، اسکرین‌شات واریز یا فیدبک واقعی قرار نداده‌اید.',
        visualSuggestion: 'باکس ریویو مشتری با آیکون ستاره',
      },
      {
        slideNumber: 4,
        type: 'content',
        title: 'اشتباه سوم: سختی ثبت سفارش',
        body: 'مشتری نمی‌داند الان باید لینک بایو برود یا دایرکت پیام دهد یا تماس بگیرد. مسیر خرید باید تک‌مرحله‌ای باشد.',
        visualSuggestion: 'آیکون فلش مستقیم و پیامک دایرکت',
      },
      {
        slideNumber: 5,
        type: 'cta',
        title: 'می‌خواهی پیجت را رایگان آنالیز کنیم؟',
        body: 'کلمه "فروش" را برای ما دایرکت ارسال کن تا ۳ ایراد اصلی پیجت را بهت بگیم.',
        visualSuggestion: 'تصویر آیکون دایرکت و باکس ورودی پیام',
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [lang, setLang] = useState<'fa' | 'en'>('fa');

  // Workspace
  const [workspace, setWorkspace] = useState<Workspace>(() => {
    const saved = localStorage.getItem('flow_workspace');
    return saved ? JSON.parse(saved) : DEFAULT_WORKSPACE;
  });

  // Ideas
  const [ideas, setIdeas] = useState<Idea[]>(() => {
    const saved = localStorage.getItem('flow_ideas');
    return saved ? JSON.parse(saved) : INITIAL_IDEAS;
  });

  // Contents
  const [contents, setContents] = useState<ContentItem[]>(() => {
    const saved = localStorage.getItem('flow_contents');
    return saved ? JSON.parse(saved) : INITIAL_CONTENTS;
  });

  const [activeContentId, setActiveContentId] = useState<string | null>(null);

  // Sidebar Mobile & Desktop Collapse State
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('flow_sidebar_collapsed') === 'true';
  });

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleSidebarCollapsed = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('flow_sidebar_collapsed', String(next));
      return next;
    });
  };

  // Copilot State
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [copilotMessages, setCopilotMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'سلام! من دستیار هوشمند Flow AI هستم. به تمام اطلاعات حافظه برند، ایده‌ها و تقویم شما دسترسی دارم. چطور می‌تونم امروز در تولید یا بهبود محتوا کمکتون کنم؟',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'محتوای آماده انتشار امروز',
      message: 'ریلز "۳ ترفند روانی واچ‌تایم" برای انتشار امروز ساعت ۱۹:۳۰ برنامه‌ریزی شده است.',
      type: 'scheduled',
      read: false,
      createdAt: new Date().toISOString(),
      contentId: 'content-1',
    },
    {
      id: 'notif-2',
      title: 'پیشنهاد هوش مصنوعی',
      message: 'ایده کاروسل "۵ اشتباه فروش" آماده تبدیل به سناریوی نهایی است.',
      type: 'suggestion',
      read: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ]);

  // Save to localStorage as backup/cache
  useEffect(() => {
    localStorage.setItem('flow_workspace', JSON.stringify(workspace));
  }, [workspace]);

  useEffect(() => {
    localStorage.setItem('flow_ideas', JSON.stringify(ideas));
  }, [ideas]);

  useEffect(() => {
    localStorage.setItem('flow_contents', JSON.stringify(contents));
  }, [contents]);

  // Auth Listener & Firestore Live Sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);

      if (currentUser) {
        // Sync Workspace from Firestore
        const wsDocRef = doc(db, 'workspaces', currentUser.uid);
        const unsubWs = onSnapshot(
          wsDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              setWorkspace(docSnap.data() as Workspace);
            } else {
              // Create initial workspace in Firestore for this user
              const initialUserWorkspace: Workspace = {
                ...workspace,
                userId: currentUser.uid,
                id: currentUser.uid,
              };
              setDoc(wsDocRef, initialUserWorkspace).catch((err) =>
                handleFirestoreError(err, OperationType.CREATE, `workspaces/${currentUser.uid}`)
              );
            }
          },
          (error) => {
            handleFirestoreError(error, OperationType.GET, `workspaces/${currentUser.uid}`);
          }
        );

        // Sync Ideas
        const ideasQuery = query(collection(db, 'ideas'), where('userId', '==', currentUser.uid));
        const unsubIdeas = onSnapshot(
          ideasQuery,
          (querySnap) => {
            if (!querySnap.empty) {
              const fetchedIdeas = querySnap.docs.map((d) => ({
                id: d.id,
                ...d.data(),
              })) as Idea[];
              setIdeas(fetchedIdeas);
            }
          },
          (error) => {
            handleFirestoreError(error, OperationType.LIST, 'ideas');
          }
        );

        // Sync Contents
        const contentsQuery = query(
          collection(db, 'contents'),
          where('userId', '==', currentUser.uid)
        );
        const unsubContents = onSnapshot(
          contentsQuery,
          (querySnap) => {
            if (!querySnap.empty) {
              const fetchedContents = querySnap.docs.map((d) => ({
                id: d.id,
                ...d.data(),
              })) as ContentItem[];
              setContents(fetchedContents);
            }
          },
          (error) => {
            handleFirestoreError(error, OperationType.LIST, 'contents');
          }
        );

        return () => {
          unsubWs();
          unsubIdeas();
          unsubContents();
        };
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Google Sign-in failed:', err);
    }
  };

  const signOut = async () => {
    try {
      await fbSignOut(auth);
      setUser(null);
    } catch (err) {
      console.error('Sign-out failed:', err);
    }
  };

  const updateWorkspace = async (updates: Partial<Workspace>) => {
    const updated = {
      ...workspace,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    setWorkspace(updated);

    if (user) {
      try {
        await updateDoc(doc(db, 'workspaces', user.uid), updated);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `workspaces/${user.uid}`);
      }
    }
  };

  const saveProduct = async (product: ProductService) => {
    const currentProducts = workspace.products || [];
    const index = currentProducts.findIndex((p) => p.id === product.id);
    let newProducts: ProductService[];
    if (index >= 0) {
      newProducts = [...currentProducts];
      newProducts[index] = product;
    } else {
      newProducts = [...currentProducts, product];
    }
    await updateWorkspace({ products: newProducts });
  };

  const deleteProduct = async (productId: string) => {
    const currentProducts = workspace.products || [];
    const newProducts = currentProducts.filter((p) => p.id !== productId);
    await updateWorkspace({ products: newProducts });
  };

  // Ideas CRUD
  const addIdea = async (ideaData: Omit<Idea, 'id' | 'userId' | 'createdAt' | 'workspaceId'>): Promise<string> => {
    const newId = 'idea-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    const newIdea: Idea = {
      ...ideaData,
      id: newId,
      userId: user?.uid || 'demo-user',
      workspaceId: workspace.id,
      createdAt: new Date().toISOString(),
    };

    setIdeas((prev) => [newIdea, ...prev]);

    if (user) {
      try {
        await setDoc(doc(db, 'ideas', newId), newIdea);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `ideas/${newId}`);
      }
    }

    addNotification({
      title: 'ایده جدید ذخیره شد',
      message: `ایده "${newIdea.title}" به استودیوی ایده‌ها اضافه شد.`,
      type: 'suggestion',
    });

    return newId;
  };

  const updateIdea = async (id: string, updates: Partial<Idea>) => {
    setIdeas((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item))
    );

    if (user) {
      try {
        await updateDoc(doc(db, 'ideas', id), updates);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `ideas/${id}`);
      }
    }
  };

  const deleteIdea = async (id: string) => {
    setIdeas((prev) => prev.filter((item) => item.id !== id));
    if (user) {
      try {
        await deleteDoc(doc(db, 'ideas', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `ideas/${id}`);
      }
    }
  };

  // Core Loop: Convert Idea to Scenario or Format Studio
  const convertIdeaToContent = async (idea: Idea, targetType?: ContentType): Promise<string> => {
    const finalType = targetType || idea.contentType;
    const newId = 'content-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);

    const newContent: ContentItem = {
      id: newId,
      workspaceId: workspace.id,
      userId: user?.uid || 'demo-user',
      ideaId: idea.id,
      title: idea.title,
      contentType: finalType,
      stage: 'scenario',
      status: 'in_progress',
      hook: idea.title,
      hooks: [idea.title],
      scenarioText: idea.description,
      caption: `${idea.title}\n\n${idea.description}\n\n📌 ذخیره کنید برای بعد!`,
      hashtags: ['تولید_محتوا', 'رشد_کسب_و_کار', finalType],
      cta: 'نظرت رو در کامنت‌ها بنویس!',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setContents((prev) => [newContent, ...prev]);

    // Update parent idea status
    await updateIdea(idea.id, { status: 'in_progress' });

    if (user) {
      try {
        await setDoc(doc(db, 'contents', newId), newContent);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `contents/${newId}`);
      }
    }

    setActiveContentId(newId);

    // Route to appropriate studio
    if (finalType === 'reel') {
      setCurrentView('reel-studio');
    } else if (finalType === 'carousel') {
      setCurrentView('carousel-studio');
    } else if (finalType === 'story') {
      setCurrentView('story-studio');
    } else {
      setCurrentView('scenario-studio');
    }

    addNotification({
      title: 'ایده به سناریو تبدیل شد',
      message: `محتوای "${idea.title}" برای تکمیل و سناریونویسی باز شد.`,
      type: 'ready',
      contentId: newId,
    });

    return newId;
  };

  // Content CRUD
  const addContent = async (
    itemData: Omit<ContentItem, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'workspaceId'>
  ): Promise<string> => {
    const newId = 'content-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    const newContent: ContentItem = {
      ...itemData,
      id: newId,
      userId: user?.uid || 'demo-user',
      workspaceId: workspace.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setContents((prev) => [newContent, ...prev]);

    if (user) {
      try {
        await setDoc(doc(db, 'contents', newId), newContent);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `contents/${newId}`);
      }
    }

    return newId;
  };

  const updateContent = async (id: string, updates: Partial<ContentItem>) => {
    setContents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c))
    );

    if (user) {
      try {
        await updateDoc(doc(db, 'contents', id), updates);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `contents/${id}`);
      }
    }
  };

  const deleteContent = async (id: string) => {
    setContents((prev) => prev.filter((c) => c.id !== id));
    if (activeContentId === id) {
      setActiveContentId(null);
    }
    if (user) {
      try {
        await deleteDoc(doc(db, 'contents', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `contents/${id}`);
      }
    }
  };

  const duplicateContent = async (id: string): Promise<string> => {
    const item = contents.find((c) => c.id === id);
    if (!item) return '';

    const newId = 'content-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    const copy: ContentItem = {
      ...item,
      id: newId,
      title: `${item.title} (نسخه کپی)`,
      status: 'draft',
      stage: 'scenario',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setContents((prev) => [copy, ...prev]);
    if (user) {
      try {
        await setDoc(doc(db, 'contents', newId), copy);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `contents/${newId}`);
      }
    }

    addNotification({
      title: 'محتوا کپی شد',
      message: `نسخه جدید از "${item.title}" ایجاد شد.`,
      type: 'ready',
      contentId: newId,
    });

    return newId;
  };

  // Copilot Helpers
  const addCopilotMessage = (role: 'user' | 'assistant', content: string, appliedAction?: string) => {
    const newMsg: AIChatMessage = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      role,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      appliedAction,
    };
    setCopilotMessages((prev) => [...prev, newMsg]);
  };

  const clearCopilotChat = () => {
    setCopilotMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'گفتگو پاک شد. چطور می‌تونم کمکتون کنم؟',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Notification Helpers
  const addNotification = (notifData: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notifData,
      id: 'notif-' + Date.now(),
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const activeContent = contents.find((c) => c.id === activeContentId) || null;

  return (
    <AppContext.Provider
      value={{
        user,
        authLoading,
        signInWithGoogle,
        signOut,
        currentView,
        setCurrentView,
        lang,
        setLang,
        workspace,
        updateWorkspace,
        saveProduct,
        deleteProduct,
        ideas,
        addIdea,
        updateIdea,
        deleteIdea,
        convertIdeaToContent,
        contents,
        activeContentId,
        setActiveContentId,
        activeContent,
        addContent,
        updateContent,
        deleteContent,
        duplicateContent,
        isCopilotOpen,
        setIsCopilotOpen,
        copilotMessages,
        addCopilotMessage,
        clearCopilotChat,
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        toggleSidebarCollapsed,
        notifications,
        markNotificationRead,
        addNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
