'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl'; // ✅ 1. Importar el hook de traducción
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { APP_NAME } from '@/lib/constants';
import styles from './signin.module.css';

export default function SignInPage() {
  const t = useTranslations('auth'); // ✅ 2. Cargar traducciones de 'auth'
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const logoSrc = mounted && resolvedTheme === 'dark' 
    ? '/icons/icon-white-192x192.svg' 
    : '/icons/icon-192x192.svg';

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signIn('email', { email, callbackUrl: '/' });
    setIsLoading(false);
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    signIn(provider, { callbackUrl: '/' });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        
        <div className={styles.logoContainer}>
          <Link href="/">
              <Image src={logoSrc} alt="Logo" width={60} height={60} priority />
          </Link>
        </div>

        {/* ✅ Texto traducido + variable APP_NAME */}
        <h1 className={styles.title}>
            {t('welcome', { appName: APP_NAME })}
        </h1>
        <p className={styles.subtitle}>{t('subtitle')}</p>
        
        {/* BOTONES SOCIALES */}
        <div className={styles.socialButtons}>
            {/* GOOGLE */}
            <button onClick={() => handleSocialLogin('google')} className={styles.socialBtn} disabled={isLoading}>
                <img src="https://authjs.dev/img/providers/google.svg" alt="Google" width={20} height={20} />
                <span>{t('google')}</span>
            </button>
            
            {/* GITHUB */}
             <button onClick={() => handleSocialLogin('github')} className={styles.socialBtn} disabled={isLoading}>
                <img src="https://authjs.dev/img/providers/github.svg" alt="GitHub" width={20} height={20} />
                <span>{t('github')}</span>
            </button>
        </div>

        <div className={styles.divider}>
            <span>{t('emailDivider')}</span>
        </div>
        
        {/* FORMULARIO MAGIC LINK */}
        <form onSubmit={handleEmailLogin} className={styles.form}>
          <Input 
            type="email" 
            placeholder={t('emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
          <Button type="submit" className={styles.fullWidth} disabled={isLoading}>
            {isLoading ? t('sending') : t('magicLink')}
          </Button>
        </form>

        <div className={styles.footer}>
          <Link href="/" className={styles.backLink}>← {t('backToHome')}</Link>
        </div>
      </div>
    </div>
  );
}