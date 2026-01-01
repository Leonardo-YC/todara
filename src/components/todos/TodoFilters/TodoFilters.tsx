'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import type { TodoFiltersProps } from '@/types';
import styles from './TodoFilters.module.css';

export const TodoFilters: React.FC<TodoFiltersProps> = ({ currentFilter, onChange }) => {
  const filters = [
    { value: 'all', label: 'Todos' },
    { value: 'active', label: 'Activos' },
    { value: 'completed', label: 'Completados' },
  ] as const;

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