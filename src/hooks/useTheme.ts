import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'auto';

export const useTheme = () => {
  // Inicializar estado leyendo localStorage o por defecto 'auto'
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    return savedTheme && ['light', 'dark', 'auto'].includes(savedTheme) ? savedTheme : 'auto';
  });

  const [appliedTheme, setAppliedTheme] = useState<'light' | 'dark'>('light');

  // 1. OBSERVER: Sincronizar 'appliedTheme' cuando cambia el atributo en <html>
  useEffect(() => {
    // Función para actualizar estado si el DOM cambia
    const updateAppliedTheme = () => {
      const currentTheme = document.documentElement.getAttribute('data-bs-theme') as 'light' | 'dark';
      if (currentTheme) setAppliedTheme(currentTheme);
    };

    // Observer para cambios externos (hechos por otras instancias del hook)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-bs-theme') {
          updateAppliedTheme();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-bs-theme'] });

    // Inicialización
    updateAppliedTheme();

    return () => observer.disconnect();
  }, []);

  // 2. APLICADOR: Cuando este hook cambia 'theme', actualiza el DOM
  useEffect(() => {
    const root = document.documentElement;
    const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    const applyTheme = (themeToApply: Theme) => {
      let effectiveTheme: 'light' | 'dark';

      if (themeToApply === 'auto') {
        effectiveTheme = getSystemTheme();
      } else {
        effectiveTheme = themeToApply;
      }

      // Solo tocar el DOM si es necesario (el observer actualizará el estado 'appliedTheme')
      if (root.getAttribute('data-bs-theme') !== effectiveTheme) {
        root.setAttribute('data-bs-theme', effectiveTheme);
      }
    };

    applyTheme(theme);
    localStorage.setItem('theme', theme);

    // Si es auto, escuchar cambios del sistema
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('auto');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // 3. SINCRONIZADOR DE ESTADO: Escuchar cambios de localStorage (otras pestañas) o eventos locales
  useEffect(() => {
    const handleStorageChange = () => {
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
        setTheme(savedTheme);
      }
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
      let newTheme: Theme;
      if (prev === 'auto') newTheme = 'light';
      else if (prev === 'light') newTheme = 'dark';
      else newTheme = 'auto'; // Default fallback

      localStorage.setItem('theme', newTheme);
      window.dispatchEvent(new Event('local-theme-change'));
      return newTheme;
    });
  };

  return { theme, toggleTheme, appliedTheme };
};
