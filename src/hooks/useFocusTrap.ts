/**
 * useFocusTrap - Hook para atrapar el foco dentro de un contenedor (para modales)
 */

import { useEffect, RefObject } from 'react';

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Atrapa el foco dentro de un elemento contenedor
 * @param containerRef - Referencia al elemento contenedor
 * @param isActive - Si la trampa está activa
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement>,
  isActive: boolean
) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;

    // Obtener todos los elementos enfocables
    const getFocusableElements = () => {
      return Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
      ).filter((el) => {
        // Filtrar elementos ocultos
        return (
          el.offsetWidth > 0 &&
          el.offsetHeight > 0 &&
          !el.hasAttribute('hidden')
        );
      });
    };

    // Enfocar el primer elemento al montar
    const focusableElements = getFocusableElements();
    const firstElement = focusableElements[0];
    
    if (firstElement) {
      firstElement.focus();
    }

    // Manejar tecla Tab
    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      
      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement;

      // Shift + Tab (hacia atrás)
      if (event.shiftKey) {
        if (activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab (hacia adelante)
        if (activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTab);

    return () => {
      container.removeEventListener('keydown', handleTab);
    };
  }, [containerRef, isActive]);
}