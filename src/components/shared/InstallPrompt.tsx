'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Para evitar errores de hidratación
  const t = useTranslations('install');

  useEffect(() => {
    setIsMounted(true);

    // 1. Si ya es una PWA instalada, no mostramos nada
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // 2. Revisamos la memoria de la SESIÓN actual (sessionStorage)
    // Si el usuario ya lo cerró en esta pestaña/sesión, no molestamos más por hoy.
    const hasClosedSession = sessionStorage.getItem('pwa_prompt_session_dismissed');
    if (hasClosedSession) return;

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Retrasamos la aparición 3 segundos para que no sea agresivo al entrar
      setTimeout(() => setShowPrompt(true), 3000);
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

  const handleClose = () => {
    setShowPrompt(false);
    // ✅ CAMBIO CLAVE: Usamos sessionStorage en lugar de localStorage
    // Esto hace que si cierras el navegador y vuelves a entrar, te vuelva a preguntar.
    sessionStorage.setItem('pwa_prompt_session_dismissed', 'true');
  };

  // Evitamos renderizar en el servidor o si no hay prompt
  if (!isMounted || !showPrompt) return null;

  return (
    // ✅ DISEÑO NUEVO: Flotante abajo a la derecha, estilo "Toast" elegante
    <div className="fixed bottom-6 right-6 z-50 w-[90%] md:w-[22rem] animate-in slide-in-from-bottom-5 duration-700 fade-in">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-4">
        
        {/* Cabecera: Icono y Texto */}
        <div className="flex gap-4 items-start relative">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-3 rounded-xl text-white shadow-lg shadow-blue-500/20 shrink-0">
            <Download size={22} />
          </div>
          <div className="flex-1 pr-6">
            <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight mb-1">
              {t('title')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t('desc')}
            </p>
          </div>
          
          {/* Botón Cerrar (X) absoluto arriba derecha */}
          <button 
            onClick={handleClose} 
            className="absolute -top-1 -right-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 transition-colors bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Botón de Acción Principal */}
        <button 
          onClick={handleInstall}
          className="w-full bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white text-sm font-semibold py-2.5 rounded-lg transition-all shadow-md active:scale-[0.98]"
        >
          {t('btn')}
        </button>
      </div>
    </div>
  );
}