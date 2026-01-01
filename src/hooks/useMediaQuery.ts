/**
 * useMediaQuery - Hook para diseño responsivo
 */

import { useState, useEffect } from 'react';

/**
 * Verificar si una media query coincide
 * @param query - Cadena CSS de media query
 * @returns Booleano indicando si la query coincide
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    
    // Establecer valor inicial
    setMatches(mediaQuery.matches);

    // Crear listener de eventos
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Agregar listener
    mediaQuery.addEventListener('change', handleChange);

    // Limpieza
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}

/**
 * Hooks de breakpoints comunes
 */
export function useIsMobile() {
  return useMediaQuery('(max-width: 640px)');
}

export function useIsTablet() {
  return useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
}

export function useIsDesktop() {
  return useMediaQuery('(min-width: 1025px)');
}

export function useIsDarkMode() {
  return useMediaQuery('(prefers-color-scheme: dark)');
}