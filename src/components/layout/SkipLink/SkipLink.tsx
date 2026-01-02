import React from 'react';
import { useTranslations } from 'next-intl';
import styles from './SkipLink.module.css';

export const SkipLink = () => {
  const t = useTranslations('a11y');

  return (
    <a href="#main-content" className={styles.link}>
      {t('skipToMain')}
    </a>
  );
};