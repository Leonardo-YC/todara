'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function CookieBanner() {
  const t = useTranslations('CookieBanner');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificamos si ya existe el consentimiento en el almacenamiento local
    const consent = localStorage.getItem('todara-cookie-consent');
    if (!consent) {
      // Usamos un pequeño retraso para que la animación de entrada se vea suave
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    // Guardamos la decisión en el navegador para siempre (o hasta que borren caché)
    localStorage.setItem('todara-cookie-consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    // 🔥 FIX: Quitamos 'right-0' y 'justify-center' para que se quede anclado a la izquierda
    <div className="fixed bottom-0 left-0 z-50 p-4 sm:p-6 pointer-events-none flex">
      
      {/* 🔥 FIX: Diseño horizontal original, usando max-w-2xl para que sea un rectángulo elegante */}
      <div className="pointer-events-auto w-full max-w-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 animate-in slide-in-from-bottom-10 fade-in duration-700">
        
        {/* Icono */}
        <div className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-2xl shrink-0">
          <Cookie className="h-6 w-6 text-zinc-900 dark:text-zinc-100" />
        </div>
        
        {/* Textos */}
        <div className="flex-1 space-y-1.5">
          <h3 className="font-bold text-lg tracking-tight text-zinc-900 dark:text-white">
            {t('title')}
          </h3>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed pr-4">
            {t('description')}
          </p>
        </div>
        
        {/* Botón */}
        <div className="w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
          <Button 
            onClick={handleAccept} 
            className="w-full sm:w-auto h-12 px-8 rounded-xl font-bold bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-all active:scale-95 shadow-lg"
          >
            {t('accept')}
          </Button>
        </div>

      </div>
    </div>
  );
}