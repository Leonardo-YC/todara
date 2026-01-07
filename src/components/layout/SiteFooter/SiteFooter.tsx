import React from 'react';
import { useTranslations } from 'next-intl';
import styles from './SiteFooter.module.css';

export function SiteFooter() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        <div className={styles.textRow}>
          {/* Grupo 1: Copyright */}
          <span className={styles.item}>
            © {year} <strong className={styles.brand}>Todara</strong>
          </span>

          {/* Separador 1 */}
          <span className={styles.separator} aria-hidden="true">•</span>

          {/* Grupo 2: Marca */}
          <span className={styles.item}>
            {t('copyright')} <span className={styles.brand}>LYC Labs</span>
          </span>

          {/* Separador 2 */}
          <span className={styles.separator} aria-hidden="true">•</span>

          {/* Grupo 3: Dev */}
          <span className={styles.item}>
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
        </div>
      </div>
    </footer>
  );
}