'use client';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import styles from './error.module.css';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Error de Autenticación</h1>
        <p className={styles.message}>Ocurrió un error: {error}</p>
        <Link href="/auth/signin" className={styles.link}>
          <Button>Intentar de nuevo</Button>
        </Link>
      </div>
    </div>
  );
}