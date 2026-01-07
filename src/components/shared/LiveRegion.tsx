'use client';

import { useEffect, useState } from 'react';
import styles from './LiveRegion.module.css'; // ✅ Importamos estilos

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
    // ✅ Usamos la clase del módulo
    <div role="status" aria-live={politeness} aria-atomic="true" className={styles.srOnly}>
      {currentMessage}
    </div>
  );
}