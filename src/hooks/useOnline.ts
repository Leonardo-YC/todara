'use client';

import { useState, useEffect } from 'react';

export function useOnline(): boolean {
  // Asumimos true inicialmente para evitar problemas de hidratación
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Verificar estado real al montar en el cliente
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}