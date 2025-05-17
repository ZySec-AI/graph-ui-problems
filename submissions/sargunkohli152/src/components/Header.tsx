// Header component that provides the application title and theme toggle functionality
// Manages dark/light mode through theme store and DOM class manipulation
import React, { useEffect } from 'react';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { useThemeStore } from '../store/themeStore';

const Header: React.FC = () => {
  // Get theme state and toggle function from theme store
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  // Update document class when theme changes
  // This enables Tailwind's dark mode styles
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <header className="w-full py-4 shadow-xl bg-blue-500 dark:bg-gray-800">
      <div className="relative px-8 mx-auto flex items-center justify-between gap-2 sm:flex-row flex-col">
        {/* Application title and logo */}
        <div className="flex items-center gap-2 text-white">
          <BarChartOutlinedIcon style={{ fontSize: 48 }} />
          <h1 className="text-3xl whitespace-nowrap tracking-tight mt-2.5 font-semibold text-white">
            Graph Visualizer
          </h1>
        </div>

        {/* Theme toggle button with dynamic icon and text */}
        <button
          onClick={toggleDarkMode}
          className="p-2 px-3 rounded-full flex items-center gap-2 bg-white"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
            <LightModeOutlinedIcon style={{ fontSize: 18 }} className="text-gray-800" />
          ) : (
            <BedtimeIcon style={{ fontSize: 18 }} className="text-gray-800" />
          )}
          <p className="whitespace-nowrap text-sm text-gray-800">
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </p>
        </button>
      </div>
    </header>
  );
};

export default Header;
