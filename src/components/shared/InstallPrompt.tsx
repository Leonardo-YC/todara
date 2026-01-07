'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import styles from './InstallPrompt.module.css';

// ⚙️ CONFIGURACIÓN: ¿Cada cuántas horas quieres que vuelva a salir?
// Puedes cambiar este 24 por 6 o 12 si prefieres que sea más insistente.
const COOLDOWN_HOURS = 24; 

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const t = useTranslations('install');

  useEffect(() => {
    setIsMounted(true);

    // 1. Si ya es una App instalada, no mostramos NADA.
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // 2. Lógica de "Memoria Inteligente"
    const lastDismissed = localStorage.getItem('pwa_last_dismissed');
    
    if (lastDismissed) {
      const lastDate = parseInt(lastDismissed, 10);
      const now = Date.now();
      const hoursPassed = (now - lastDate) / (1000 * 60 * 60); // Convertimos milisegundos a horas

      // Si NO han pasado las horas de espera, no molestamos al usuario.
      if (hoursPassed < COOLDOWN_HOURS) {
        return; 
      }
    }

    // 3. Escuchamos el evento real del navegador
    const handler = (e: any) => {
      e.preventDefault(); // Evitamos que Chrome muestre su aviso feo
      setDeferredPrompt(e);
      
      // Esperamos 3 segundos para que cargue la web primero y no sea agresivo
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
      // Si acepta, limpiamos el registro para que no salga más (o se comporte nativo)
      localStorage.removeItem('pwa_last_dismissed');
    }
    setDeferredPrompt(null);
  };

  const handleClose = () => {
    setShowPrompt(false);
    // ✅ Guardamos la HORA ACTUAL como "última vez visto"
    localStorage.setItem('pwa_last_dismissed', Date.now().toString());
  };

  if (!isMounted || !showPrompt) return null;

  return (
    <div className={styles.toastContainer}>
      <div className={styles.card}>
        
        <button onClick={handleClose} className={styles.closeIcon} aria-label="Cerrar">
          <X size={16} />
        </button>

        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <Download size={24} />
          </div>
          <div className={styles.textContent}>
            <h3>{t('title')}</h3>
            <p>{t('desc')}</p>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={handleClose} className={styles.btnClose}>
            Ahora no
          </button>
          <button onClick={handleInstall} className={styles.btnInstall}>
            {t('btn')}
          </button>
        </div>

      </div>
    </div>
  );
}