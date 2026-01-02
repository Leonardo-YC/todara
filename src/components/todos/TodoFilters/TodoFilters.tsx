'use client';
import React from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import type { TodoFiltersProps, TodoFilter } from '@/types';
import styles from './TodoFilters.module.css';

export const TodoFilters: React.FC<TodoFiltersProps> = ({ currentFilter, onChange }) => {
  const t = useTranslations('filters');

  // Definimos los filtros usando las traducciones
  const filters: { value: TodoFilter; label: string }[] = [
    { value: 'all', label: t('all') },
    { value: 'active', label: t('active') },
    { value: 'completed', label: t('completed') },
  ];

  return (
    <nav className={styles.nav}>
      {filters.map((f) => (
        <button
          key={f.value}
          className={cn(styles.tab, currentFilter === f.value && styles.active)}
          onClick={() => onChange(f.value)}
        >
          {f.label}
        </button>
      ))}
    </nav>
  );
};