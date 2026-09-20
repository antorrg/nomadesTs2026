import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const THEME_KEY = 'theme';

const getStoredTheme = (): Theme => {
  const savedTheme = localStorage.getItem(THEME_KEY);
  return savedTheme === 'dark' ? 'dark' : 'light';
};

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(getStoredTheme);

  const [appliedTheme, setAppliedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const updateAppliedTheme = () => {
      const currentTheme = document.documentElement.getAttribute('data-bs-theme') as 'light' | 'dark';
      if (currentTheme) setAppliedTheme(currentTheme);
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-bs-theme') {
          updateAppliedTheme();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-bs-theme'] });

    updateAppliedTheme();

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (root.getAttribute('data-bs-theme') !== theme) {
      root.setAttribute('data-bs-theme', theme);
      }

    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const handleStorageChange = () => {
      setTheme(getStoredTheme());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-theme-change', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-theme-change', handleStorageChange);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prev => {
      return prev === 'light' ? 'dark' : 'light';
    });
  };

  return { theme, toggleTheme, appliedTheme };
};
