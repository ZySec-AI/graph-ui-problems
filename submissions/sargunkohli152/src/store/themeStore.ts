import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleDarkMode: () => {
        console.log('Theme store - Current state:', useThemeStore.getState());
        set((state) => {
          console.log('Theme store - Toggling from:', state.isDarkMode);
          return { isDarkMode: !state.isDarkMode };
        });
        console.log('Theme store - New state:', useThemeStore.getState());
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        console.log('Theme store - Hydrated state:', state);
      },
    }
  )
);
