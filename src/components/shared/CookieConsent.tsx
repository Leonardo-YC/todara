'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl'; // ✅ Importamos hook de traducción
import styles from './CookieConsent.module.css';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const t = useTranslations('cookies'); // ✅ Cargamos el bloque 'cookies'

  useEffect(() => {
    // 1. Revisamos si ya existe la cookie de consentimiento
    const consent = localStorage.getItem('todara_cookie_consent');
    
    // Si NO existe (es null), mostramos el banner
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('todara_cookie_consent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('todara_cookie_consent', 'declined');
    setShowBanner(false);
  };

  // Si no debe mostrarse, no renderizamos nada
  if (!showBanner) return null;

  return (
    <div className={styles.banner} role="region" aria-label="Cookie Consent">
      <div className={styles.content}>
        <p className={styles.text}>
          {t('text')}
        </p>
        
        <div className={styles.actions}>
          <button onClick={handleDecline} className={styles.declineBtn}>
            {t('decline')}
          </button>
          <button onClick={handleAccept} className={styles.acceptBtn}>
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  );
}