/**
 * LanguageToggle - Selector de idioma accesible
 */
'use client';

import { useRouter, usePathname } from 'next/navigation';
import type { Locale } from '@/types';
import styles from './LanguageToggle.module.css';

interface LanguageToggleProps {
  currentLocale: Locale;
}

export function LanguageToggle({ currentLocale }: LanguageToggleProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: Locale) => {
    console.log(`Cambiando idioma a: ${newLocale}`);
    // Aquí iría la lógica real de cambio de ruta en el futuro
  };

  return (
    <div role="radiogroup" aria-label="Cambiar idioma" className={styles.container}>
      <button
        role="radio"
        aria-checked={currentLocale === 'en'}
        aria-label="Switch to English"
        onClick={() => handleLocaleChange('en')}
        className={`${styles.button} ${currentLocale === 'en' ? styles.active : ''}`}
      >
        <span aria-hidden="true">🇺🇸</span> EN
      </button>

      <button
        role="radio"
        aria-checked={currentLocale === 'es'}
        aria-label="Cambiar a Español"
        onClick={() => handleLocaleChange('es')}
        className={`${styles.button} ${currentLocale === 'es' ? styles.active : ''}`}
      >
        <span aria-hidden="true">🇪🇸</span> ES
      </button>
    </div>
  );
}