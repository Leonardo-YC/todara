'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Todo, TodoContextType, TodoFilter, TodoFormData } from '@/types';
import { useOnline } from '@/hooks/useOnline';

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Hook personalizado para saber si hay internet
  const isOnline = useOnline();

  // Cargar todos al inicio
  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/todos');
        if (res.ok) {
          const data = await res.json();
          setTodos(data.todos);
        }
      } catch (err) {
        console.error('Error cargando todos:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  // Sincronización básica cuando vuelve internet
  useEffect(() => {
    if (isOnline) {
      fetch('/api/todos')
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data?.todos) setTodos(data.todos);
        })
        .catch(console.error);
    }
  }, [isOnline]);

  const addTodo = async (data: TodoFormData) => {
    // 1. Optimistic Update
    const tempId = `temp-${Date.now()}`;
    const optimisticTodo: Todo = {
      id: tempId,
      text: data.text,
      completed: false,
      userId: 'me',
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: data.dueDate || null,
    };

    setTodos((prev) => [optimisticTodo, ...prev]);

    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Error al guardar');

      const newTodo = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === tempId ? newTodo : t)));

    } catch (err) {
      if (!navigator.onLine) {
        console.log('Guardado localmente (Offline)');
      } else {
        setTodos((prev) => prev.filter((t) => t.id !== tempId));
        setError('Error al crear tarea');
        throw err;
      }
    }
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const updatedTodo = { ...todo, completed: !todo.completed };
    setTodos((prev) => prev.map((t) => (t.id === id ? updatedTodo : t)));

    try {
      await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: updatedTodo.completed }),
      });
    } catch (err) {
      if (navigator.onLine) {
        setTodos((prev) => prev.map((t) => (t.id === id ? todo : t)));
        setError('Error al actualizar');
      }
    }
  };

  const deleteTodo = async (id: string) => {
    const prevTodos = [...todos];
    setTodos((prev) => prev.filter((t) => t.id !== id));

    try {
      await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    } catch (err) {
      if (navigator.onLine) {
        setTodos(prevTodos);
        setError('Error al eliminar');
      }
    }
  };

  const clearCompleted = async () => {
    const prevTodos = [...todos];
    setTodos((prev) => prev.filter((t) => !t.completed));

    try {
      await fetch('/api/todos/clear-completed', { method: 'POST' });
    } catch (err) {
      if (navigator.onLine) {
        setTodos(prevTodos);
      }
    }
  };

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    try {
        await fetch(`/api/todos/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
    } catch (error) {
        // Revertir recargando si hay error real de conexión y estamos online
        if(navigator.onLine) {
            const res = await fetch('/api/todos');
            if (res.ok) {
                const data = await res.json();
                setTodos(data.todos);
            }
        }
    }
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        filter,
        setFilter,
        isLoading,
        error,
        isOnline, // <--- ¡AQUÍ ESTÁ LA CORRECCIÓN! ✅
        addTodo,
        toggleTodo,
        deleteTodo,
        clearCompleted,
        updateTodo
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
}