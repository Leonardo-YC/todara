import React from 'react';

interface LoadingSkeletonProps {
  variant?: 'todo-list' | 'todo-item' | 'form';
  count?: number;
  className?: string;
}

export function LoadingSkeleton({
  variant = 'todo-item',
  count = 1,
  className = '',
}: LoadingSkeletonProps) {
  if (variant === 'todo-list') {
    return (
      <div className={`space-y-3 ${className}`} aria-label="Cargando..." aria-busy="true">
        {Array.from({ length: count }).map((_, i) => (
          <TodoItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (variant === 'form') {
    return (
      <div className={`${className}`} aria-label="Cargando formulario" aria-busy="true">
        <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
      </div>
    );
  }

  return <TodoItemSkeleton className={className} />;
}

function TodoItemSkeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 ${className}`}
    >
      <div className="w-5 h-5 bg-slate-200 dark:bg-slate-700 rounded animate-pulse flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-3/4" />
      </div>
    </div>
  );
}