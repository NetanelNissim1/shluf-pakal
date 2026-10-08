import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Header } from './components/layout/Header';
import { BottomNav, NavTab } from './components/layout/BottomNav';
import { HomePage } from './pages/HomePage';
import { RandomizerModal } from './components/randomizer/RandomizerModal';
import { FeedbackDrawer } from './components/common/FeedbackDrawer';
import { OnboardingTour } from './components/common/OnboardingTour';
import { usePakalStore } from './store/usePakalStore';
import { CategoryId } from './types';
import { initContentProtection } from './lib/security';
import { initFeedbackSync } from './lib/feedback';

// Dynamic lazy imports for heavy game pages & modules (Bundle Splitting & Lazy Loading)
const CategoryPage = lazy(() => import('./pages/CategoryPage').then(m => ({ default: m.CategoryPage })));
const TabooPage = lazy(() => import('./pages/TabooPage').then(m => ({ default: m.TabooPage })));
const MyPakalPage = lazy(() => import('./pages/MyPakalPage').then(m => ({ default: m.MyPakalPage })));
const ODTPage = lazy(() => import('./pages/ODTPage').then(m => ({ default: m.ODTPage })));
const VisualRiddlesPage = lazy(() => import('./pages/VisualRiddlesPage').then(m => ({ default: m.VisualRiddlesPage })));
const TrueFalsePage = lazy(() => import('./pages/TrueFalsePage').then(m => ({ default: m.TrueFalsePage })));
const StudentViewerPage = lazy(() => import('./components/visual/StudentViewerPage').then(m => ({ default: m.StudentViewerPage })));

// Accessible loading fallback for dynamic transitions
const PageLoadingFallback: React.FC = () => (
  <div 
    className="flex flex-col items-center justify-center min-h-[50vh] py-16 space-y-4 animate-fade-in select-none" 
    role="status" 
    aria-label="טוען תוכן מהפק&quot;ל..."
  >
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 animate-ping opacity-25" />
      <div className="w-12 h-12 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
    </div>
    <div className="flex items-center gap-2 text-stone-500 dark:text-orange-300/80 font-medium text-sm">
      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
      <span>שולף מהפק&quot;ל...</span>
    </div>
  </div>
);

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

  // Apply theme class to <html> tag & sync browser status bar meta theme-color
  useEffect(() => {
    const root = document.documentElement;
    const isCamp = themeMode === 'campfire';
    if (isCamp) {
      root.classList.add('campfire', 'dark');
      root.style.backgroundColor = '#000000';
    } else {
      root.classList.remove('campfire', 'dark');
      root.style.backgroundColor = '#fffdf7';
    }

    // Sync mobile browser status bar color (Safari iOS & Chrome Android)
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isCamp ? '#000000' : '#f59e0b');
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

  const handleNavigateTrueFalse = () => {
    setCurrentTab('true-false');
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
      <Suspense fallback={<PageLoadingFallback />}>
        <StudentViewerPage
          riddleId={studentRiddleId}
          onExitStudentMode={() => {
            setStudentMode(false);
            if (typeof window !== 'undefined') {
              window.history.replaceState({}, '', window.location.pathname);
            }
          }}
        />
      </Suspense>
    );
  }

  return (
    <div className={`min-h-screen min-h-screen-dvh flex flex-col font-sans transition-colors duration-200 select-none ${
      themeMode === 'campfire' ? 'bg-black text-orange-100' : 'bg-[#fffdf7] text-stone-900'
    }`}>
      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-lg mx-auto px-3.5 sm:px-4 pt-3.5 pb-safe">
        <Suspense fallback={<PageLoadingFallback />}>
          {currentTab === 'home' && (
            <HomePage
              onNavigateCategory={handleNavigateCategory}
              onNavigateTaboo={handleNavigateTaboo}
              onNavigatePakal={handleNavigatePakal}
              onNavigateODT={handleNavigateODT}
              onNavigateVisual={handleNavigateVisual}
              onNavigateTrueFalse={handleNavigateTrueFalse}
            />
          )}

          {currentTab === 'categories' && (
            <CategoryPage 
              onNavigateVisual={handleNavigateVisual}
              onNavigateTaboo={handleNavigateTaboo}
              onNavigateTrueFalse={handleNavigateTrueFalse}
            />
          )}

          {currentTab === 'odt' && <ODTPage />}

          {currentTab === 'visual' && <VisualRiddlesPage />}

          {currentTab === 'taboo' && <TabooPage />}

          {currentTab === 'true-false' && (
            <TrueFalsePage onBack={() => setCurrentTab('home')} />
          )}

          {currentTab === 'pakal' && (
            <MyPakalPage onExploreClick={() => setCurrentTab('home')} />
          )}
        </Suspense>
      </main>

      {/* Floating Randomizer Modal */}
      <RandomizerModal />

      {/* Quick Feedback & Suggestions Drawer */}
      <FeedbackDrawer currentTab={currentTab} />

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
