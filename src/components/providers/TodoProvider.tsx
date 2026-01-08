'use client';

// ✅ 1. Importamos useCallback
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Todo, TodoContextType, TodoFilter, TodoFormData } from '@/types';
import { useOnline } from '@/hooks/useOnline';
import { useTranslations } from 'next-intl';

interface ExtendedTodoContextType extends TodoContextType {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

const TodoContext = createContext<ExtendedTodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const t = useTranslations('errors');
  
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>('all');
  
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(20);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isOnline = useOnline();

  // 1. Detectar tamaño pantalla
  useEffect(() => {
    const handleResize = () => {
      setLimit(window.innerWidth < 768 ? 10 : 20);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ 2. Fetcher (ENVUELTO EN useCallback)
  // Esto evita que la función se re-cree en cada render, evitando bucles infinitos.
  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/todos'); 
      if (res.ok) {
        const data = await res.json();
        setTodos(data.todos);
      }
    } catch (err) {
      console.error(err);
      setError(t('loadFailed'));
    } finally {
      setIsLoading(false);
    }
  }, [t]); // 't' es una dependencia porque se usa dentro para el error

  // ✅ 3. useEffect corregido
  // Ahora podemos incluir fetchTodos sin miedo a bucles
  useEffect(() => {
    fetchTodos();
  }, [isOnline, fetchTodos]);

  const addTodo = async (data: TodoFormData) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticTodo: Todo = {
      id: tempId,
      text: data.text,
      completed: false,
      userId: 'me',
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: data.dueDate || null,
      priority: data.priority || 'normal',
    } as Todo;

    setTodos((prev) => [optimisticTodo, ...prev]);

    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Error al guardar');
      
      await fetchTodos();

    } catch (err) {
      setTodos((prev) => prev.filter((t) => t.id !== tempId));
      setError(t('createFailed'));
    }
  };

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    const oldTodo = todos.find(t => t.id === id);
    if (!oldTodo) return;

    setTodos(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    
    try {
        await fetch(`/api/todos/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
    } catch (error) {
        setTodos(prev => prev.map(t => t.id === id ? oldTodo : t));
        setError(t('updateFailed'));
    }
  };

  const toggleTodo = async (id: string) => {
     const t = todos.find(x => x.id === id);
     if(t) await updateTodo(id, { completed: !t.completed });
  };

  const deleteTodo = async (id: string) => {
    const prevTodos = [...todos];
    setTodos((prev) => prev.filter((t) => t.id !== id));

    try {
      await fetch(`/api/todos/${id}`, { method: 'DELETE' });
      await fetchTodos();
    } catch (err) {
      setTodos(prevTodos);
      setError(t('deleteFailed'));
    }
  };

  const clearCompleted = async () => {
    const prevTodos = [...todos];
    setTodos((prev) => prev.filter((t) => !t.completed));
    try {
      await fetch('/api/todos/clear-completed', { method: 'POST' });
      await fetchTodos();
    } catch (err) {
      setTodos(prevTodos);
      // No seteamos error aquí para no molestar si falla silenciosamente
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
        isOnline,
        selectedDate,
        setSelectedDate,
        page,
        setPage,
        totalPages,
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
  if (context === undefined) throw new Error('useTodos error');
  return context as ExtendedTodoContextType;
}