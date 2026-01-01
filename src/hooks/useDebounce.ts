/**
 * useDebounce - Hook para aplicar debounce a un valor
 */

import { useState, useEffect } from 'react';

/**
 * Retrasa la actualización de un valor
 * @param value - Valor a aplicar debounce
 * @param delay - Retraso en milisegundos
 * @returns Valor con debounce aplicado
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configurar el temporizador
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar el temporizador si el valor cambia antes del retraso
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}