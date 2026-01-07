'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
// ✅ Importamos el CSS Module
import styles from './LandingView.module.css';

export function LandingView() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('landing');

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc = mounted && resolvedTheme === 'dark'
    ? '/icons/icon-white-512x512.svg' 
    : '/icons/icon-512x512.svg';

  return (
    <div className={styles.container}>
      
      {/* 1. LOGO */}
      <div className={styles.logoWrapper}>
         <Image 
           src={logoSrc} 
           alt="Todara Logo" 
           fill
           className={styles.logoImage}
           priority
         />
      </div>
      
      {/* 2. TÍTULO */}
      <h1 className={styles.title}>
        {t('title')} <span className={styles.brandHighlight}>Todara</span>
      </h1>
      
      {/* 3. SUBTÍTULO */}
      <p className={styles.subtitle}>
        {t.rich('subtitle', {
          bold: (chunks) => <strong>{chunks}</strong>
        })}
      </p>

      {/* 4. BOTÓN CTA */}
      <Link href="/auth/signin" className={styles.cta}>
        {t('cta')}
      </Link>
      
    </div>
  );
}