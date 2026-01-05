'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import styles from './verify.module.css';

export default function VerifyPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('verify');

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc = mounted && resolvedTheme === 'dark' 
    ? '/icons/icon-white-192x192.png' 
    : '/icons/icon-192x192.png';

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoWrapper}>
          <Image src={logoSrc} alt="Logo" width={50} height={50} />
        </div>
        
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.text}>
           {t.rich('sent', {
             bold: (chunks) => <strong>{chunks}</strong>
           })}
          <br />
          {t('click')}
        </p>
        
        <p className={styles.subtext}>
          {t('spam')}
        </p>
      </div>
    </div>
  );
}