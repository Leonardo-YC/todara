/**
 * LanguageToggle - Selector de idioma funcional
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
    // Si ya estamos en ese idioma, no hacemos nada
    if (newLocale === currentLocale) return;

    // 1. Quitamos el locale actual de la URL (ej: /es/dashboard -> /dashboard)
    // El regex /^\/(en|es)/ busca si empieza con /en o /es y lo elimina
    const pathWithoutLocale = pathname.replace(/^\/(en|es)/, '');

    // 2. Aseguramos que el path empiece con /
    const cleanPath = pathWithoutLocale.startsWith('/') 
      ? pathWithoutLocale 
      : `/${pathWithoutLocale}`;
    
    // 3. Navegamos al nuevo idioma
    router.push(`/${newLocale}${cleanPath}`);
  };

  return (
    <div 
      role="radiogroup" 
      aria-label={currentLocale === 'en' ? 'Change language' : 'Cambiar idioma'} 
      className={styles.container}
    >
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