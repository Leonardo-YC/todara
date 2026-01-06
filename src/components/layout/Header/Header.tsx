'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useTranslations, useLocale } from 'next-intl'; // ✅ Importamos useLocale
import { UserAvatar } from '@/components/shared/UserAvatar';
import { SkipLink } from '../SkipLink';
import { LanguageToggle } from '../LanguageToggle';
import { ThemeToggle } from '../ThemeToggle';
import styles from './Header.module.css';

interface HeaderProps {
  locale?: string;
}

export function Header({ locale: propLocale = 'es' }: HeaderProps) {
  const { data: session } = useSession();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('nav');
  const currentLocale = useLocale(); // ✅ Obtenemos el idioma actual dinámicamente

  useEffect(() => { setMounted(true); }, []);

  const logoSrc = mounted && resolvedTheme === 'dark' 
    ? '/icons/icon-white-192x192.svg' 
    : '/icons/icon-192x192.svg';

  const userName = session?.user?.name || session?.user?.email?.split('@')[0] || 'Usuario';

  return (
    <>
      <SkipLink />
      
      <header role="banner" className={styles.header}>
        <div className={styles.container}>
          {/* ✅ Enlace dinámico: Mantiene /en o /es */}
          <Link href={`/${currentLocale}`} aria-label="Ir al inicio" className={styles.brand}>
            <div className={styles.logoWrapper}>
              <Image 
                src={logoSrc} 
                alt="Logo Todara" 
                width={50} 
                height={50} 
                className={styles.logoImage}
                priority
              />
            </div>
            <span className={styles.brandName}>Todara</span>
          </Link>

          <nav className={styles.nav}>
            <div className={styles.toggles}>
               <LanguageToggle currentLocale={currentLocale as 'en' | 'es'} />
               <ThemeToggle />
            </div>

            {session ? (
              <Link href="/profile" className={styles.profileLink}>
                <div className={styles.userInfo}>
                    <span className={styles.userName}>{userName}</span>
                    <UserAvatar name={userName} image={session.user?.image} size={32} />
                </div>
              </Link>
            ) : (
              <Link href="/api/auth/signin" className={styles.loginBtn}>
                {t('login')}
              </Link>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}