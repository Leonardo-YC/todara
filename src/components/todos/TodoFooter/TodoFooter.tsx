'use client';
import React from 'react';
import { Button } from '@/components/ui/Button';
import { getTodoCountText } from '@/utils/plurals';
import type { TodoFooterProps } from '@/types';
import styles from './TodoFooter.module.css';

export const TodoFooter: React.FC<TodoFooterProps> = ({ activeCount, completedCount, onClearCompleted }) => {
  if (activeCount === 0 && completedCount === 0) return null;

  return (
    <footer className={styles.footer}>
      <span>{getTodoCountText(activeCount)}</span>
      {completedCount > 0 && (
        <Button variant="ghost" size="sm" onClick={onClearCompleted}>
          Limpiar completados ({completedCount})
        </Button>
      )}
    </footer>
  );
};