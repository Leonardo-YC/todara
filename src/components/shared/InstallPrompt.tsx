'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const t = useTranslations('install');

  useEffect(() => {
    // 1. Verificamos si ya está instalada como App
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) return;

    // 2. Verificamos si el usuario ya lo cerró antes (La memoria)
    const hasClosed = localStorage.getItem('pwa_prompt_closed');
    if (hasClosed) return;

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Mostramos el banner
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  // ✅ Nueva función para cerrar y GUARDAR la decisión
  const handleClose = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa_prompt_closed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80 animate-bounce-in">
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <div className="bg-blue-100 p-2 rounded-full h-fit">
              <Download className="text-blue-600 w-5 h-5" />
            </div>
            <div>
              {/* Mantenemos tus traducciones */}
              <h3 className="font-bold text-slate-900 dark:text-white">{t('title')}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t('desc')}</p>
            </div>
          </div>
          {/* Usamos la nueva función handleClose */}
          <button onClick={handleClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <button 
          onClick={handleInstall}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition-colors"
        >
          {t('btn')}
        </button>
      </div>
    </div>
  );
}