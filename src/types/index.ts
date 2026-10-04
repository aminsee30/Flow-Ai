export type ContentType = 'reel' | 'carousel' | 'story' | 'scenario';
export type ContentStage = 'idea' | 'scenario' | 'production' | 'ready' | 'scheduled' | 'published';
export type ContentStatus = 'draft' | 'in_progress' | 'ready' | 'scheduled' | 'published';

export type BrandVoiceType = 
  | 'رسمی (Formal)'
  | 'صمیمی (Friendly & Casual)'
  | 'تخصصی (Expert & Authoritative)'
  | 'آموزشی (Educational & Instructive)'
  | 'جسور (Bold & Disruptive)'
  | 'مینیمال (Minimal & Punchy)'
  | 'طنز (Witty & Humorous)';

export interface ProductService {
  id: string;
  name: string;
  description: string;
  features: string;
  benefits: string;
  targetAudience: string;
  mainCta: string;
}

export interface BrandProfile {
  brandName: string;
  industry: string;
  businessDescription: string;
  mainGoal: string;
  primaryPlatform: 'Instagram' | 'LinkedIn' | 'Telegram' | 'YouTube' | 'TikTok';
  contentLanguage: 'فارسی (Persian)' | 'English';
}

export interface TargetAudience {
  who: string;
  needs: string;
  painPoints: string;
  interests: string;
  familiarityLevel: 'تازه کار (Beginner)' | 'متوسط (Intermediate)' | 'پیشرفته (Pro)';
  buyingReasons: string;
}

export interface Workspace {
  id: string;
  userId: string;
  name: string;
  brandProfile: BrandProfile;
  targetAudience: TargetAudience;
  brandVoice: string;
  customVoiceStyle: string;
  forbiddenWords: string[];
  products: ProductService[];
  createdAt: string;
  updatedAt: string;
}

export interface Idea {
  id: string;
  workspaceId: string;
  userId: string;
  title: string;
  description: string;
  contentType: ContentType;
  contentPillar: string;
  category: string;
  goal: string;
  status: ContentStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface ReelTimecode {
  timeRange: string;
  title: string;
  description: string;
  shotType: 'Talking Head' | 'B-Roll' | 'Screen Share' | 'Product Close-up';
  onScreenText: string;
  voiceover: string;
}

export interface ReelBlueprint {
  duration: '15 sec' | '30 sec' | '45 sec' | '60 sec' | 'Custom';
  hook: string;
  scenario: string;
  voiceover: string;
  onScreenText: string;
  cta: string;
  timecodes: ReelTimecode[];
  shootingTips: string[];
  editingTips: string[];
}

export interface CarouselSlide {
  slideNumber: number;
  type: 'hook' | 'context' | 'content' | 'cta';
  title: string;
  body: string;
  visualSuggestion: string;
}

export interface StoryStep {
  stepNumber: number;
  type: 'Hook' | 'Problem' | 'Value' | 'Interaction' | 'CTA';
  title: string;
  text: string;
  interactionType?: 'Poll' | 'Question Box' | 'Quiz' | 'Emoji Slider' | 'DM Keyword';
  interactionDetails?: string;
  visualSuggestion: string;
}

export interface ContentItem {
  id: string;
  workspaceId: string;
  userId: string;
  ideaId?: string;
  title: string;
  contentType: ContentType;
  stage: ContentStage;
  status: ContentStatus;
  scheduledDate?: string; // YYYY-MM-DD
  scheduledTime?: string; // HH:MM
  
  // Scenario & Copy
  hook: string;
  hooks: string[];
  scenarioText: string;
  copywritingStyle?: string;
  caption: string;
  captionLength?: 'Short' | 'Medium' | 'Long';
  hashtags: string[];
  cta: string;
  
  // Specialized formats
  reelBlueprint?: ReelBlueprint;
  carouselSlides?: CarouselSlide[];
  storySequence?: StoryStep[];
  
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  appliedAction?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'scheduled' | 'due' | 'ready' | 'suggestion';
  read: boolean;
  createdAt: string;
  contentId?: string;
}
