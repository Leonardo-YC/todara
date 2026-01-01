/**
 * useKeyboard - Hook para navegación y atajos de teclado
 */

import { useEffect } from 'react';

export interface UseKeyboardOptions {
  onArrowDown?: () => void;
  onArrowUp?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onEnter?: () => void;
  onEscape?: () => void;
  onSpace?: () => void;
  onDelete?: () => void;
  enabled?: boolean;
}

/**
 * Hook personalizado para manejar eventos de teclado
 * @param options - Manejadores de eventos de teclado
 */
export function useKeyboard(options: UseKeyboardOptions) {
  const {
    onArrowDown,
    onArrowUp,
    onArrowLeft,
    onArrowRight,
    onEnter,
    onEscape,
    onSpace,
    onDelete,
    enabled = true,
  } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // No ejecutar si el usuario está escribiendo en un input
      const target = event.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      switch (event.key) {
        case 'ArrowDown':
          if (onArrowDown && !isInput) {
            event.preventDefault();
            onArrowDown();
          }
          break;

        case 'ArrowUp':
          if (onArrowUp && !isInput) {
            event.preventDefault();
            onArrowUp();
          }
          break;

        case 'ArrowLeft':
          if (onArrowLeft && !isInput) {
            event.preventDefault();
            onArrowLeft();
          }
          break;

        case 'ArrowRight':
          if (onArrowRight && !isInput) {
            event.preventDefault();
            onArrowRight();
          }
          break;

        case 'Enter':
          if (onEnter && !isInput) {
            event.preventDefault();
            onEnter();
          }
          break;

        case 'Escape':
          if (onEscape) {
            event.preventDefault();
            onEscape();
          }
          break;

        case ' ':
          if (onSpace && !isInput) {
            event.preventDefault();
            onSpace();
          }
          break;

        case 'Delete':
          if (onDelete && !isInput) {
            event.preventDefault();
            onDelete();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    onArrowDown,
    onArrowUp,
    onArrowLeft,
    onArrowRight,
    onEnter,
    onEscape,
    onSpace,
    onDelete,
    enabled,
  ]);
}