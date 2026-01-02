'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { WifiOff } from 'lucide-react';
import { useOnline } from '@/hooks/useOnline';

export function OfflineBanner() {
  const t = useTranslations('offline');
  const isOnline = useOnline();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowBanner(true);
    } else {
      // Si vuelve internet, ocultamos el banner después de 3 segundos
      const timer = setTimeout(() => setShowBanner(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (!showBanner) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isOnline ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="bg-yellow-100 border-b border-yellow-200 text-yellow-800 px-4 py-3 shadow-md flex justify-center items-center gap-2">
        <WifiOff size={18} />
        <span className="text-sm font-medium">
          {isOnline ? 'Conexión restaurada' : t('banner')}
        </span>
      </div>
    </div>
  );
}