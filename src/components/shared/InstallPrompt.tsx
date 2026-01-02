'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Escuchar el evento del navegador que dice "Esta app se puede instalar"
    const handler = (e: any) => {
      e.preventDefault(); // Prevenir el banner nativo feo de Chrome
      setDeferredPrompt(e);
      
      // Mostrar nuestro aviso personalizado después de 3 segundos
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    // Mostrar el prompt nativo
    await deferredPrompt.prompt();
    
    // Limpiar
    setDeferredPrompt(null);
    setShowPrompt(false);
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
              <h3 className="font-bold text-slate-900 dark:text-white">Instalar Todara</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Accede más rápido y úsala sin conexión.</p>
            </div>
          </div>
          <button onClick={() => setShowPrompt(false)} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <button 
          onClick={handleInstall}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition-colors"
        >
          Instalar App
        </button>
      </div>
    </div>
  );
}