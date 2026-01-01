import React from 'react';
import styles from './SkipLink.module.css';

export const SkipLink = () => {
  return (
    <a href="#main-content" className={styles.link}>
      Saltar al contenido principal
    </a>
  );
};