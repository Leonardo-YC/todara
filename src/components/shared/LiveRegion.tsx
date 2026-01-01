/**
 * LiveRegion - Anuncios dinámicos para lectores de pantalla
 */
'use client';

import { useEffect, useState } from 'react';

interface LiveRegionProps {
  message: string;
  politeness?: 'polite' | 'assertive';
  clearAfter?: number;
}

export function LiveRegion({ 
  message, 
  politeness = 'polite', 
  clearAfter = 3000 
}: LiveRegionProps) {
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    if (message) {
      setCurrentMessage(message);
      if (clearAfter > 0) {
        const timer = setTimeout(() => setCurrentMessage(''), clearAfter);
        return () => clearTimeout(timer);
      }
    }
  }, [message, clearAfter]);

  return (
    <div role="status" aria-live={politeness} aria-atomic="true" className="sr-only">
      {currentMessage}
    </div>
  );
}