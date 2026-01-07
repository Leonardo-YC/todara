import React from 'react';
import styles from './LoadingSkeleton.module.css'; // ✅ Importamos estilos

interface LoadingSkeletonProps {
  variant?: 'todo-list' | 'todo-item' | 'form';
  count?: number;
  className?: string; // Mantenemos por si pasas clases extra, aunque no uses Tailwind
}

export function LoadingSkeleton({
  variant = 'todo-item',
  count = 1,
}: LoadingSkeletonProps) {
  
  if (variant === 'todo-list') {
    return (
      <div className={styles.listContainer} aria-label="Cargando..." aria-busy="true">
        {Array.from({ length: count }).map((_, i) => (
          <TodoItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (variant === 'form') {
    return (
      <div className={styles.formSkeleton} aria-label="Cargando formulario" aria-busy="true">
        <div className={styles.inputSkeleton} />
      </div>
    );
  }

  return <TodoItemSkeleton />;
}

function TodoItemSkeleton() {
  return (
    <div className={styles.todoItem}>
      <div className={styles.checkboxSkeleton} />
      <div style={{ flex: 1 }}>
        <div className={styles.textSkeleton} />
      </div>
    </div>
  );
}