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

      {/* Banner Error de API (Opcional, el de conexión ya sale en el layout) */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm text-center border border-red-200">
          {error}
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
            counts={counts} // ✅ DESCOMENTADO: Es obligatorio
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