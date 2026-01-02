'use client';
import React from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import type { TodoFooterProps } from '@/types';
import styles from './TodoFooter.module.css';

export const TodoFooter: React.FC<TodoFooterProps> = ({ activeCount, completedCount, onClearCompleted }) => {
  const t = useTranslations('footer');

  if (activeCount === 0 && completedCount === 0) return null;

  return (
    <footer className={styles.footer}>
      {/* next-intl maneja el plural automáticamente basado en 'count' */}
      <span>{t('itemsLeft', { count: activeCount })}</span>
      
      {completedCount > 0 && (
        <Button variant="ghost" size="sm" onClick={onClearCompleted}>
          {t('clearCompleted')}
        </Button>
      )}
    </footer>
  );
};