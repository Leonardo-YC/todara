'use client';

import { useEffect } from 'react';

export function PwaRegistry() {
  useEffect(() => {
    // Ejecutamos el registro directamente sin esperar el 'load' de la ventana
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('✅ Todara PWA instalada exitosamente en el scope:', registration.scope);
        })
        .catch((err) => {
          console.error('❌ Error al instalar Todara PWA:', err);
        });
    }
  }, []);

  return null; 
}