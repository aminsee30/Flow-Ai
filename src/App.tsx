import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { AICopilotDrawer } from './components/copilot/AICopilotDrawer';
import { OnboardingModal } from './components/onboarding/OnboardingModal';

// Studios & Views
import { DashboardView } from './components/dashboard/DashboardView';
import { IdeaStudioView } from './components/ideas/IdeaStudioView';
import { ScenarioStudioView } from './components/scenario/ScenarioStudioView';
import { ReelStudioView } from './components/reel/ReelStudioView';
import { CarouselStudioView } from './components/carousel/CarouselStudioView';
import { StoryStudioView } from './components/story/StoryStudioView';
import { PipelineView } from './components/pipeline/PipelineView';
import { CalendarView } from './components/calendar/CalendarView';
import { AllContentView } from './components/library/AllContentView';
import { BrandMemoryView } from './components/brand/BrandMemoryView';
import { ProductsView } from './components/brand/ProductsView';
import { AudienceView } from './components/brand/AudienceView';
import { SettingsView } from './components/settings/SettingsView';

const MainLayout: React.FC = () => {
  const { currentView, lang } = useApp();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const isRtl = lang === 'fa';

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'ideas':
        return <IdeaStudioView />;
      case 'scenario-studio':
        return <ScenarioStudioView />;
      case 'reel-studio':
        return <ReelStudioView />;
      case 'carousel-studio':
        return <CarouselStudioView />;
      case 'story-studio':
        return <StoryStudioView />;
      case 'pipeline':
        return <PipelineView />;
      case 'calendar':
        return <CalendarView />;
      case 'all-content':
        return <AllContentView />;
      case 'brand-memory':
        return <BrandMemoryView />;
      case 'products':
        return <ProductsView />;
      case 'audience':
        return <AudienceView />;
      case 'onboarding':
        return <BrandMemoryView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans"
    >
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Navbar />

        <main className="flex-1 overflow-y-auto">
          {renderActiveView()}
        </main>

        {/* Global AI Copilot Drawer */}
        <AICopilotDrawer />

        {/* Brand Onboarding Wizard Modal */}
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
        />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
