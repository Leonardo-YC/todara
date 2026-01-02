/**
 * Homepage - Interfaz principal de tareas
 */

'use client';

import React, { useMemo } from 'react';
import { useTodos } from '@/components/providers';
import { TodoForm } from '@/components/todos/TodoForm';
import { TodoFilters } from '@/components/todos/TodoFilters';
import { TodoList } from '@/components/todos/TodoList';
import { TodoFooter } from '@/components/todos/TodoFooter';
import styles from './page.module.css';

export default function HomePage() {
  // 1. Consumimos el estado global y las acciones
  const {
    todos,
    filter,
    isLoading,
    error,
    isOnline,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    setFilter,
    clearCompleted,
  } = useTodos();

  // 2. Calculamos contadores (Memoizado para rendimiento)
  const counts = useMemo(() => {
    const active = todos.filter((t) => !t.completed).length;
    const completed = todos.filter((t) => t.completed).length;

    return {
      all: todos.length,
      active,
      completed,
    };
  }, [todos]);

  return (
    <div className={styles.container}>
      {/* Encabezado */}
      <header className={styles.header}>
        <h1 className={styles.title}>Todara</h1>
        <p className={styles.subtitle}>Gestiona tus tareas con excelencia</p>
      </header>

      {/* Banner Offline */}
      {!isOnline && (
        <div className={`${styles.banner} ${styles.offline}`} role="status">
          <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
          </svg>
          <span>Estás desconectado. Los cambios se guardarán cuando vuelvas a estar en línea.</span>
        </div>
      )}

      {/* Banner Error */}
      {error && (
        <div className={`${styles.banner} ${styles.error}`} role="alert">
          <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Contenido Principal */}
      <div className={styles.contentStack}>
        
        {/* Formulario de Agregar */}
        <section aria-label="Crear tarea">
          <TodoForm onSubmit={addTodo} isLoading={isLoading} />
        </section>

        {/* Filtros */}
        <section aria-label="Filtrar tareas">
          <TodoFilters
            currentFilter={filter}
            onChange={setFilter}
            counts={counts}
          />
        </section>

        {/* Lista de Tareas */}
        <section aria-label="Lista de tareas">
          <TodoList
            todos={todos}
            filter={filter}
            onToggle={toggleTodo}
            onEdit={(id, text) => updateTodo(id, { text })}
            onDelete={deleteTodo}
            isLoading={isLoading}
          />
        </section>

        {/* Pie de página con acciones */}
        {todos.length > 0 && (
          <TodoFooter
            activeCount={counts.active}
            completedCount={counts.completed}
            onClearCompleted={clearCompleted}
          />
        )}
      </div>
    </div>
  );
}