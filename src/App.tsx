import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { BottomNav, NavTab } from './components/layout/BottomNav';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { TabooPage } from './pages/TabooPage';
import { MyPakalPage } from './pages/MyPakalPage';
import { ODTPage } from './pages/ODTPage';
import { VisualRiddlesPage } from './pages/VisualRiddlesPage';
import { StudentViewerPage } from './components/visual/StudentViewerPage';
import { RandomizerModal } from './components/randomizer/RandomizerModal';
import { FeedbackDrawer } from './components/common/FeedbackDrawer';
import { OnboardingTour } from './components/common/OnboardingTour';
import { usePakalStore } from './store/usePakalStore';
import { CategoryId } from './types';
import { initContentProtection } from './lib/security';
import { initFeedbackSync } from './lib/feedback';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const { 
    themeMode, 
    textSize, 
    setActiveCategory, 
    activeSituation,
    hasCompletedOnboarding,
    startTour,
    toastMessage,
    hideToast
  } = usePakalStore();

  // Check for student viewer mode (from Circle Share QR or direct link: ?riddle=id or ?mode=student)
  const [studentMode, setStudentMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('mode') === 'student' || params.has('riddle');
    }
    return false;
  });

  const [studentRiddleId, setStudentRiddleId] = useState<string | undefined>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('riddle') || undefined;
    }
    return undefined;
  });

  // Initialize anti-scraping and content protection barriers & feedback sync
  useEffect(() => {
    const cleanupProtection = initContentProtection();
    initFeedbackSync();
    return () => {
      cleanupProtection();
    };
  }, []);

  // Check and trigger Onboarding Tour on first visit
  useEffect(() => {
    // Only trigger if onboarding has not been completed, and not in student mode
    if (!studentMode && !hasCompletedOnboarding && currentTab === 'home') {
      let isCompletedInStorage = false;
      try {
        isCompletedInStorage = localStorage.getItem('shluf_onboarding_completed') === 'true';
      } catch {}

      if (!isCompletedInStorage) {
        const timer = setTimeout(() => {
          startTour(false);
        }, 850);
        return () => clearTimeout(timer);
      }
    }
  }, [hasCompletedOnboarding, studentMode, currentTab, startTour]);

  // Apply theme class to <html> tag
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'campfire') {
      root.classList.add('campfire', 'dark');
      root.style.backgroundColor = '#000000';
    } else {
      root.classList.remove('campfire', 'dark');
      root.style.backgroundColor = '#fffdf7';
    }
  }, [themeMode]);

  // Apply text size class to <html> tag for dynamic scaling across app
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('text-size-normal', 'text-size-large', 'text-size-huge');
    root.classList.add(`text-size-${textSize || 'normal'}`);
  }, [textSize]);

  // Navigation handlers
  const handleNavigateCategory = (catId: CategoryId) => {
    setActiveCategory(catId);
    setCurrentTab('categories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateTaboo = () => {
    setCurrentTab('taboo');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigatePakal = () => {
    setCurrentTab('pakal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateODT = () => {
    setCurrentTab('odt');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateVisual = () => {
    setCurrentTab('visual');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user clicks situational chips, switch to the respective tab
  useEffect(() => {
    if (activeSituation === 'pakal') {
      setCurrentTab('pakal');
    } else if (activeSituation === 'odt') {
      setCurrentTab('odt');
    } else if (activeSituation === 'visual') {
      setCurrentTab('visual');
    }
  }, [activeSituation]);

  // Render Student Viewer if mode=student is activated
  if (studentMode) {
    return (
      <StudentViewerPage
        riddleId={studentRiddleId}
        onExitStudentMode={() => {
          setStudentMode(false);
          if (typeof window !== 'undefined') {
            window.history.replaceState({}, '', window.location.pathname);
          }
        }}
      />
    );
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 select-none ${
      themeMode === 'campfire' ? 'bg-black text-orange-100' : 'bg-[#fffdf7] text-stone-900'
    }`}>
      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-lg mx-auto px-3.5 sm:px-4 pt-3.5">
        {currentTab === 'home' && (
          <HomePage
            onNavigateCategory={handleNavigateCategory}
            onNavigateTaboo={handleNavigateTaboo}
            onNavigatePakal={handleNavigatePakal}
            onNavigateODT={handleNavigateODT}
            onNavigateVisual={handleNavigateVisual}
          />
        )}

        {currentTab === 'categories' && <CategoryPage />}

        {currentTab === 'odt' && <ODTPage />}

        {currentTab === 'visual' && <VisualRiddlesPage />}

        {currentTab === 'taboo' && <TabooPage />}

        {currentTab === 'pakal' && (
          <MyPakalPage onExploreClick={() => setCurrentTab('home')} />
        )}
      </main>

      {/* Floating Randomizer Modal */}
      <RandomizerModal />

      {/* Quick Feedback & Suggestions Drawer */}
      <FeedbackDrawer />

      {/* Onboarding Coach Marks Tour */}
      <OnboardingTour />

      {/* Non-blocking Toast Notification Pill */}
      {toastMessage && (
        <div 
          onClick={hideToast}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full shadow-2xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer animate-fade-in transition-all border border-emerald-500/40 bg-stone-900/95 text-emerald-400 dark:bg-stone-900/95 dark:text-emerald-300 dark:border-emerald-600/40 backdrop-blur-md select-none touch-press"
          role="status"
          aria-live="polite"
        >
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Fixed Bottom Navigation Bar with Center FAB */}
      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
};

export default App;
