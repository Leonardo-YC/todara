/**
 * useLocalStorage - Hook para sincronizar estado con localStorage
 */

import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';

/**
 * Hook personalizado para localStorage con soporte TypeScript
 * @param key - Clave de localStorage
 * @param initialValue - Valor inicial si la clave no existe
 * @returns [value, setValue, removeValue]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Estado para almacenar nuestro valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      logger.error('Error leyendo de localStorage', error, { key });
      return initialValue;
    }
  });

  // Retorna una versión envuelta de la función setter de useState que persiste en localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Permitir que el valor sea una función para tener la misma API que useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        // Guardar estado
        setStoredValue(valueToStore);

        // Guardar en localStorage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        logger.error('Error guardando en localStorage', error, { key });
      }
    },
    [key, storedValue]
  );

  // Eliminar valor de localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      logger.error('Error eliminando de localStorage', error, { key });
    }
  }, [key, initialValue]);

  // Escuchar cambios en otras pestañas/ventanas
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          logger.error('Error parseando cambio de localStorage', error, { key });
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue, removeValue];
}