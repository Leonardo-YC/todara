'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';

export function LandingView() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('landing'); // Carga las traducciones de la sección landing

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc = mounted && resolvedTheme === 'dark'
    ? '/icons/icon-white-512x512.png' 
    : '/icons/icon-512x512.png';

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '60vh', 
      textAlign: 'center',
      padding: '1rem' 
    }}>
      <div style={{ marginBottom: '2rem', position: 'relative', width: '120px', height: '120px' }}>
         <Image 
           src={logoSrc} 
           alt="Todara Logo" 
           fill
           style={{ objectFit: 'contain' }}
           priority
         />
      </div>
      
      <h1 style={{ 
        fontSize: '3.5rem', 
        fontWeight: '800', 
        color: 'var(--color-text-primary)',
        marginBottom: '1rem', 
        lineHeight: 1.1 
      }}>
        {t('title')} <span style={{ color: 'var(--color-primary-600)' }}>Todara</span>
      </h1>
      
      <p style={{ 
        fontSize: '1.25rem', 
        color: 'var(--color-text-secondary)',
        maxWidth: '600px', 
        marginBottom: '3rem' 
      }}>
        {/* Esto permite que "LYC Labs" se mantenga en negrita en ambos idiomas */}
        {t.rich('subtitle', {
          bold: (chunks) => <strong>{chunks}</strong>
        })}
      </p>

      <Link href="/auth/signin" style={{
        backgroundColor: 'var(--color-primary-600)',
        color: '#ffffff',
        padding: '1rem 2.5rem',
        borderRadius: '9999px',
        fontSize: '1.125rem',
        fontWeight: '600',
        textDecoration: 'none',
        boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)',
        transition: 'all 0.2s ease'
      }}>
        {t('cta')}
      </Link>
    </div>
  );
}