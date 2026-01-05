'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl'; // ✅ 1. Importar
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import styles from './error.module.css';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const t = useTranslations('authError'); // ✅ 2. Cargar sección 'authError' del JSON

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Usamos las claves del JSON */}
        <h1 className={styles.title}>{t('title')}</h1>
        
        <p className={styles.message}>
          {error === 'Configuration' 
            ? t('config') 
            : t('access')}
        </p>
        
        <Link href="/auth/signin" className={styles.link}>
          <Button className={styles.fullWidth}>{t('retry')}</Button>
        </Link>
      </div>
    </div>
  );
}