/**
 * TodoProvider - Gestión del estado global de tareas usando Context API
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Todo, TodoFilter, TodoContextType, TodoFormData } from '@/types';
import { logger } from '@/lib/logger';

// Crear el contexto
const TodoContext = createContext<TodoContextType | undefined>(undefined);

// Componente Provider
export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [operationQueue, setOperationQueue] = useState<any[]>([]);

  // Verificar estado de conexión (Online/Offline)
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Estado inicial
    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cargar tareas al montar el componente
  useEffect(() => {
    fetchTodos();
  }, []);

  // Sincronizar cola de operaciones cuando vuelva la conexión
  useEffect(() => {
    if (isOnline && operationQueue.length > 0) {
      syncQueue();
    }
  }, [isOnline]);

  /**
   * Obtener todas las tareas desde la API
   */
  const fetchTodos = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/todos');
      
      if (!response.ok) {
        throw new Error('Error al obtener las tareas');
      }

      const data = await response.json();
      setTodos(data.todos || []);
      logger.info('Tareas obtenidas', { count: data.todos?.length });
    } catch (err) {
      logger.error('Error obteniendo tareas', err);
      setError('No se pudieron cargar las tareas');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Agregar una nueva tarea
   */
  const addTodo = useCallback(async (data: TodoFormData) => {
    if (!isOnline) {
      // Encolar si estamos offline
      setOperationQueue((prev) => [...prev, { type: 'create', data }]);
      logger.info('Tarea encolada (offline)', { text: data.text });
      return;
    }

    setError(null);

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: data.text,
          dueDate: data.dueDate?.toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear la tarea');
      }

      const { todo } = await response.json();
      setTodos((prev) => [todo, ...prev]);
      logger.info('Tarea creada', { todoId: todo.id });
    } catch (err) {
      logger.error('Error creando tarea', err);
      setError('No se pudo crear la tarea');
      throw err;
    }
  }, [isOnline]);

  /**
   * Actualizar una tarea existente
   */
  const updateTodo = useCallback(async (id: string, updates: Partial<Todo>) => {
    if (!isOnline) {
      setOperationQueue((prev) => [...prev, { type: 'update', id, updates }]);
      // Actualización optimista (UI primero)
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      );
      return;
    }

    // Actualización optimista
    const previousTodos = todos;
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: updates.text,
          completed: updates.completed,
          dueDate: updates.dueDate instanceof Date ? updates.dueDate.toISOString() : updates.dueDate,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la tarea');
      }

      const { todo } = await response.json();
      // Confirmar con datos reales del servidor
      setTodos((prev) => prev.map((t) => (t.id === id ? todo : t)));
      logger.info('Tarea actualizada', { todoId: id });
    } catch (err) {
      // Revertir cambios si falla
      setTodos(previousTodos);
      logger.error('Error actualizando tarea', err);
      setError('No se pudo actualizar la tarea');
      throw err;
    }
  }, [isOnline, todos]);

  /**
   * Alternar estado completado/pendiente
   */
  const toggleTodo = useCallback(async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    await updateTodo(id, { completed: !todo.completed });
  }, [todos, updateTodo]);

  /**
   * Eliminar una tarea
   */
  const deleteTodo = useCallback(async (id: string) => {
    if (!isOnline) {
      setOperationQueue((prev) => [...prev, { type: 'delete', id }]);
      // Eliminación optimista
      setTodos((prev) => prev.filter((t) => t.id !== id));
      return;
    }

    // Eliminación optimista
    const previousTodos = todos;
    setTodos((prev) => prev.filter((t) => t.id !== id));

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la tarea');
      }

      logger.info('Tarea eliminada', { todoId: id });
    } catch (err) {
      // Revertir cambios si falla
      setTodos(previousTodos);
      logger.error('Error eliminando tarea', err);
      setError('No se pudo eliminar la tarea');
      throw err;
    }
  }, [isOnline, todos]);

  /**
   * Eliminar todas las tareas completadas
   */
  const clearCompleted = useCallback(async () => {
    if (!isOnline) {
      setOperationQueue((prev) => [...prev, { type: 'clearCompleted' }]);
      setTodos((prev) => prev.filter((t) => !t.completed));
      return;
    }

    const previousTodos = todos;
    setTodos((prev) => prev.filter((t) => !t.completed));

    try {
      const response = await fetch('/api/todos/clear-completed', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Error al limpiar tareas completadas');
      }

      const { deleted } = await response.json();
      logger.info('Tareas completadas limpiadas', { count: deleted });
    } catch (err) {
      setTodos(previousTodos);
      logger.error('Error limpiando completadas', err);
      setError('No se pudieron limpiar las tareas completadas');
      throw err;
    }
  }, [isOnline, todos]);

  /**
   * Sincronizar cola de operaciones (al volver online)
   */
  const syncQueue = async () => {
    logger.info('Sincronizando cola de operaciones', { count: operationQueue.length });

    for (const operation of operationQueue) {
      try {
        switch (operation.type) {
          case 'create':
            await addTodo(operation.data);
            break;
          case 'update':
            await updateTodo(operation.id, operation.updates);
            break;
          case 'delete':
            await deleteTodo(operation.id);
            break;
          case 'clearCompleted':
            await clearCompleted();
            break;
        }
      } catch (err) {
        logger.error('Error sincronizando operación', err, { operation });
      }
    }

    setOperationQueue([]);
    await fetchTodos(); // Refrescar lista completa al terminar
  };

  const value: TodoContextType = {
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
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

/**
 * Hook personalizado para usar el contexto de Todos
 */
export function useTodos() {
  const context = useContext(TodoContext);
  
  if (context === undefined) {
    throw new Error('useTodos debe ser usado dentro de un TodoProvider');
  }
  
  return context;
}