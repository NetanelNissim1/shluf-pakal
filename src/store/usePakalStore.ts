import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import confetti from 'canvas-confetti';
import { CategoryId, SituationFilter, ThemeMode, TextSize, UxMode, FeedbackSubmission, StoredFeedbackItem } from '../types';
import { triggerHaptic } from '../lib/haptics';
import { sanitizeSearchQuery } from '../lib/security';

interface PakalState {
  // UX Mode (Settings Toggle: Classic vs. Enhanced 2.0)
  uxMode: UxMode;
  setUxMode: (mode: UxMode) => void;
  toggleUxMode: () => void;

  // Theme & Environment
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;

  // Text Scaling (Accessibility & Field Reading)
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  cycleTextSize: () => void;

  // Sound & Haptics settings
  soundEnabled: boolean;
  toggleSound: () => void;
  hapticsEnabled: boolean;
  toggleHaptics: () => void;

  // Personal Pakal (Favorites)
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;

  // Reveal state for anti-peeking
  revealedMap: Record<string, boolean>;
  toggleReveal: (id: string) => void;
  revealAll: (ids: string[]) => void;
  hideAll: () => void;
  isRevealed: (id: string) => boolean;

  // Filters & Navigation
  activeSituation: SituationFilter;
  setActiveSituation: (filter: SituationFilter) => void;
  activeCategory: CategoryId | null;
  setActiveCategory: (cat: CategoryId | null) => void;
  activeSubCategory: string | null;
  setActiveSubCategory: (sub: string | null) => void;
  activeDifficulty: 'all' | 'easy' | 'medium' | 'hard';
  setActiveDifficulty: (diff: 'all' | 'easy' | 'medium' | 'hard') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Randomizer Modal
  isRandomizerOpen: boolean;
  openRandomizer: () => void;
  closeRandomizer: () => void;

  // Feedback & Suggestions (Quick Drawer & Offline Outbox)
  isFeedbackDrawerOpen: boolean;
  openFeedbackDrawer: () => void;
  closeFeedbackDrawer: () => void;
  savedFeedbackUser: { name: string; email: string; organization: string };
  saveFeedbackUserInfo: (info: { name: string; email?: string; organization?: string }) => void;
  pendingFeedbackQueue: StoredFeedbackItem[];
  queuePendingFeedback: (item: FeedbackSubmission) => StoredFeedbackItem;
  removePendingFeedback: (id: string) => void;
  clearPendingFeedbackQueue: () => void;

  // Non-blocking Toast Notification
  toastMessage: string | null;
  showToast: (msg: string, duration?: number) => void;
  hideToast: () => void;

  // Onboarding Tour & Coach Marks (First Visit Guide)
  hasCompletedOnboarding: boolean;
  isOnboardingActive: boolean;
  currentTourStep: number;
  startTour: (manual?: boolean) => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  skipTour: () => void;
  completeTour: () => void;
}

export const usePakalStore = create<PakalState>()(
  persist(
    (set, get) => ({
      // UX Mode (Classic vs. Enhanced 2.0)
      uxMode: 'enhanced',
      setUxMode: (mode) => {
        if (get().hapticsEnabled) triggerHaptic(25);
        set({ uxMode: mode });
      },
      toggleUxMode: () => {
        const next = get().uxMode === 'classic' ? 'enhanced' : 'classic';
        if (get().hapticsEnabled) triggerHaptic(30);
        set({ uxMode: next });
        get().showToast(
          next === 'enhanced'
            ? 'עברת לעיצוב משחקים משודרג! ✨'
            : 'חזרת לעיצוב הקלאסי של האתר 🏷️',
          2500
        );
      },

      // Theme
      themeMode: 'sun',
      toggleTheme: () => {
        const next = get().themeMode === 'sun' ? 'campfire' : 'sun';
        if (get().hapticsEnabled) triggerHaptic(30);
        set({ themeMode: next });
      },
      setTheme: (mode) => set({ themeMode: mode }),

      // Text Scaling
      textSize: 'normal',
      setTextSize: (size: TextSize) => {
        if (get().hapticsEnabled) triggerHaptic(20);
        set({ textSize: size });
      },
      cycleTextSize: () => {
        const cur = get().textSize;
        const next: TextSize = cur === 'normal' ? 'large' : cur === 'large' ? 'huge' : 'normal';
        if (get().hapticsEnabled) triggerHaptic([25, 20]);
        set({ textSize: next });
      },

      // Sound & Haptics
      soundEnabled: true,
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      hapticsEnabled: true,
      toggleHaptics: () => set((state) => ({ hapticsEnabled: !state.hapticsEnabled })),

      // Favorites
      favorites: [],
      toggleFavorite: (id) => {
        const current = get().favorites;
        const exists = current.includes(id);
        const updated = exists ? current.filter((item) => item !== id) : [...current, id];
        if (get().hapticsEnabled) triggerHaptic(exists ? 20 : [30, 40, 30]);
        set({ favorites: updated });
      },
      isFavorite: (id) => get().favorites.includes(id),
      clearFavorites: () => set({ favorites: [] }),

      // Reveal / Anti-Peeking
      revealedMap: {},
      toggleReveal: (id) => {
        const current = !!get().revealedMap[id];
        if (get().hapticsEnabled) triggerHaptic(20);
        set((state) => ({
          revealedMap: {
            ...state.revealedMap,
            [id]: !current
          }
        }));
      },
      revealAll: (ids) => {
        const newMap: Record<string, boolean> = { ...get().revealedMap };
        ids.forEach((id) => {
          newMap[id] = true;
        });
        if (get().hapticsEnabled) triggerHaptic(40);
        set({ revealedMap: newMap });
      },
      hideAll: () => {
        if (get().hapticsEnabled) triggerHaptic(20);
        set({ revealedMap: {} });
      },
      isRevealed: (id) => !!get().revealedMap[id],

      // Filters
      activeSituation: 'all',
      setActiveSituation: (filter) => {
        if (get().hapticsEnabled) triggerHaptic(25);
        set({ activeSituation: filter });
      },
      activeCategory: null,
      setActiveCategory: (cat) => {
        if (get().hapticsEnabled) triggerHaptic(25);
        set({ activeCategory: cat, activeSubCategory: null });
      },
      activeSubCategory: null,
      setActiveSubCategory: (sub) => {
        if (get().hapticsEnabled) triggerHaptic(25);
        set({ activeSubCategory: sub });
      },
      activeDifficulty: 'all',
      setActiveDifficulty: (diff) => {
        if (get().hapticsEnabled) triggerHaptic(20);
        set({ activeDifficulty: diff });
      },
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: sanitizeSearchQuery(query) }),

      // Randomizer
      isRandomizerOpen: false,
      openRandomizer: () => {
        if (get().hapticsEnabled) triggerHaptic([40, 50]);
        set({ isRandomizerOpen: true });
      },
      closeRandomizer: () => set({ isRandomizerOpen: false }),

      // Feedback & Suggestions
      isFeedbackDrawerOpen: false,
      openFeedbackDrawer: () => {
        if (get().hapticsEnabled) triggerHaptic(25);
        set({ isFeedbackDrawerOpen: true });
      },
      closeFeedbackDrawer: () => set({ isFeedbackDrawerOpen: false }),
      savedFeedbackUser: { name: '', email: '', organization: '' },
      saveFeedbackUserInfo: (info) => {
        set(() => ({
          savedFeedbackUser: {
            name: info.name.trim(),
            email: (info.email || '').trim(),
            organization: (info.organization || '').trim()
          }
        }));
      },
      pendingFeedbackQueue: [],
      queuePendingFeedback: (item) => {
        const newItem: StoredFeedbackItem = {
          ...item,
          id: 'fb-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
          createdAt: Date.now()
        };
        set((state) => ({
          pendingFeedbackQueue: [newItem, ...state.pendingFeedbackQueue]
        }));
        return newItem;
      },
      removePendingFeedback: (id) => {
        set((state) => ({
          pendingFeedbackQueue: state.pendingFeedbackQueue.filter((fb) => fb.id !== id)
        }));
      },
      clearPendingFeedbackQueue: () => set({ pendingFeedbackQueue: [] }),

      // Non-blocking Toast Notification
      toastMessage: null,
      showToast: (msg: string, duration = 3200) => {
        set({ toastMessage: msg });
        setTimeout(() => {
          if (get().toastMessage === msg) {
            set({ toastMessage: null });
          }
        }, duration);
      },
      hideToast: () => set({ toastMessage: null }),

      // Onboarding Tour & Coach Marks
      hasCompletedOnboarding: false,
      isOnboardingActive: false,
      currentTourStep: 0,
      startTour: (manual = false) => {
        if (!manual && get().hasCompletedOnboarding) return;
        if (get().hapticsEnabled) triggerHaptic([30, 20]);
        set({ isOnboardingActive: true, currentTourStep: 0 });
      },
      nextTourStep: () => {
        const current = get().currentTourStep;
        if (current < 5) {
          if (get().hapticsEnabled) triggerHaptic(15);
          set({ currentTourStep: current + 1 });
        } else {
          get().completeTour();
        }
      },
      prevTourStep: () => {
        const current = get().currentTourStep;
        if (current > 0) {
          if (get().hapticsEnabled) triggerHaptic(15);
          set({ currentTourStep: current - 1 });
        }
      },
      skipTour: () => {
        if (get().hapticsEnabled) triggerHaptic(20);
        try {
          localStorage.setItem('shluf_onboarding_completed', 'true');
        } catch {}
        set({ isOnboardingActive: false, hasCompletedOnboarding: true });
      },
      completeTour: () => {
        if (get().hapticsEnabled) triggerHaptic([30, 50, 40]);
        try {
          localStorage.setItem('shluf_onboarding_completed', 'true');
          confetti({
            particleCount: 55,
            spread: 65,
            origin: { y: 0.8 },
            colors: ['#f59e0b', '#10b981', '#3b82f6']
          });
        } catch {}
        set({ isOnboardingActive: false, hasCompletedOnboarding: true });
      },
    }),
    {
      name: 'shluf-storage',
      partialize: (state) => ({
        themeMode: state.themeMode,
        textSize: state.textSize,
        soundEnabled: state.soundEnabled,
        hapticsEnabled: state.hapticsEnabled,
        favorites: state.favorites,
        savedFeedbackUser: state.savedFeedbackUser,
        pendingFeedbackQueue: state.pendingFeedbackQueue,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        uxMode: state.uxMode
      })
    }
  )
);
