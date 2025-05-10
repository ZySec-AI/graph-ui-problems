import { useEffect, useState } from 'react';

export const useDarkMode = (): [boolean, () => void] => {
  const [darkMode, setDarkMode] = useState<boolean>(true); // Default to dark mode

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    
    if (savedMode) {
      setDarkMode(savedMode === 'true');
    } else {
      // Default to dark if no saved preference
      setDarkMode(true);
      localStorage.setItem('darkMode', 'true');
    }
  }, []);

  // Update document and save preference when dark mode changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return [darkMode, toggleDarkMode];
}; 