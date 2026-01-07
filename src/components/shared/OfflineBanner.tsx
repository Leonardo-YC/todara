'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { WifiOff } from 'lucide-react';
import { useOnline } from '@/hooks/useOnline';
import styles from './OfflineBanner.module.css'; // ✅ Importamos estilos

export function OfflineBanner() {
  const t = useTranslations('offline');
  const isOnline = useOnline();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowBanner(true);
    } else {
      const timer = setTimeout(() => setShowBanner(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (!showBanner) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      // ✅ Combinamos clases lógicamente
      className={`${styles.banner} ${isOnline ? styles.hidden : styles.visible}`}
    >
      <div className={styles.content}>
        <WifiOff size={18} />
        <span className={styles.text}>
          {isOnline ? 'Conexión restaurada' : t('banner')}
        </span>
      </div>
    </div>
  );
}