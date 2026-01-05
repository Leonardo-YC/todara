'use client';
import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl'; // ✅ Importar
import { TodoItem } from '../TodoItem/TodoItem';
import type { TodoListProps } from '@/types';
import styles from './TodoList.module.css';

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  filter,
  onToggle,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  const t = useTranslations('todo'); // ✅ Cargar traducciones

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active': return todos.filter((t) => !t.completed);
      case 'completed': return todos.filter((t) => t.completed);
      default: return todos;
    }
  }, [todos, filter]);

  if (isLoading) return <div className={styles.emptyState}>{t('loading')}</div>;
  if (filteredTodos.length === 0) return <div className={styles.emptyState}>{t('empty')}</div>;

  return (
    <ul className={styles.list}>
      {filteredTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};