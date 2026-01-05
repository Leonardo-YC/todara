import React from 'react';
import { useTranslations } from 'next-intl';
import styles from './SiteFooter.module.css';

export function SiteFooter() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        <p className={styles.textRow}>
          {/* Bloque 1: Copyright */}
          <span>© {year} <strong className={styles.brand}>Todara</strong></span>
          
          <span className={styles.separator} aria-hidden="true">•</span>
          
          {/* Bloque 2: Marca (Traducido) */}
          <span>
            {t('copyright')} <span className={styles.brand}>LYC Labs</span>
          </span>
          
          <span className={styles.separator} aria-hidden="true">•</span>
          
          {/* Bloque 3: Firma (Traducido) */}
          <span>
            {t('dev')}:{' '}
            <a 
              href="https://www.linkedin.com/in/leonardo-yupán-crúz-4b7158336" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.devLink}
              title="Ver perfil de LeonardoYC"
            >
              LeonardoYC
            </a>
          </span>
        </p>
      </div>
    </footer>
  );
}