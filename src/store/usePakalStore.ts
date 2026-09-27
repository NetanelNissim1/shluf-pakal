import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CategoryId, SituationFilter, ThemeMode } from '../types';
import { triggerHaptic } from '../lib/haptics';

interface PakalState {
  // Theme & Environment
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;

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
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Randomizer Modal
  isRandomizerOpen: boolean;
  openRandomizer: () => void;
  closeRandomizer: () => void;
}

export const usePakalStore = create<PakalState>()(
  persist(
    (set, get) => ({
      // Theme
      themeMode: 'sun',
      toggleTheme: () => {
        const next = get().themeMode === 'sun' ? 'campfire' : 'sun';
        if (get().hapticsEnabled) triggerHaptic(30);
        set({ themeMode: next });
      },
      setTheme: (mode) => set({ themeMode: mode }),

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
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Randomizer
      isRandomizerOpen: false,
      openRandomizer: () => {
        if (get().hapticsEnabled) triggerHaptic([40, 50]);
        set({ isRandomizerOpen: true });
      },
      closeRandomizer: () => set({ isRandomizerOpen: false }),
    }),
    {
      name: 'shluf-storage',
      partialize: (state) => ({
        themeMode: state.themeMode,
        soundEnabled: state.soundEnabled,
        hapticsEnabled: state.hapticsEnabled,
        favorites: state.favorites
      })
    }
  )
);
