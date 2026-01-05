'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useTodos } from '@/components/providers';
import { TodoForm } from '@/components/todos/TodoForm';
import { TodoList } from '@/components/todos/TodoList';
import { EditTodoModal } from '@/components/todos/EditTodoModal';
import { Modal } from '@/components/ui/Modal'; 
import { Button } from '@/components/ui/Button';
import { isToday, isFuture } from 'date-fns';
import { isOverdue } from '@/lib/date-utils'; 
import { ChevronLeft, ChevronRight } from 'lucide-react'; 
import type { Todo } from '@/types';
import styles from '@/app/[locale]/page.module.css';

const ITEMS_PER_PAGE = 20;

// ✅ Definimos el tipo de prioridad aquí para que coincida con el formulario
type Priority = 'low' | 'normal' | 'high';

export function TodoAppView() {
  const { todos, addTodo, toggleTodo, deleteTodo, updateTodo, clearCompleted, isLoading } = useTodos();
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'today';

  const tNav = useTranslations('nav');
  const tTodo = useTranslations('todo');
  const tModals = useTranslations('modals.clearCompleted');
  const tPag = useTranslations('pagination');

  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [view]);

  // 🧠 LÓGICA DE FILTROS
  const filteredTodos = useMemo(() => {
    if (view === 'inbox') return todos.filter(t => !t.dueDate && !t.completed);
    
    if (view === 'today') {
      return todos.filter(t => {
        if (t.completed) return false;
        if (!t.dueDate) return false; 
        const d = new Date(t.dueDate);
        return isToday(d); 
      });
    }

    if (view === 'overdue') {
      return todos.filter(t => !t.completed && t.dueDate && isOverdue(t.dueDate));
    }

    if (view === 'upcoming') {
      return todos.filter(t => {
        if (t.completed || !t.dueDate) return false;
        const d = new Date(t.dueDate);
        return isFuture(d) && !isToday(d); 
      });
    }
    
    if (view === 'completed') return todos.filter(t => t.completed);

    return [];
  }, [todos, view]);

  // ORDENAMIENTO
  const sortedTodos = useMemo(() => {
    const priorityMap: Record<string, number> = { high: 3, normal: 2, low: 1 };
    
    return [...filteredTodos].sort((a, b) => {
      const pA = priorityMap[a.priority || 'normal'];
      const pB = priorityMap[b.priority || 'normal'];
      if (pA !== pB) return pB - pA;

      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filteredTodos]);

  // 📄 LÓGICA DE PAGINACIÓN
  const totalPages = Math.ceil(sortedTodos.length / ITEMS_PER_PAGE);
  const paginatedTodos = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedTodos.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedTodos, currentPage]);

  const getTitle = () => {
    switch(view) {
      case 'inbox': return `📥 ${tNav('inbox')}`;
      case 'today': return `📅 ${tNav('today')}`;
      case 'overdue': return `⚠️ ${tNav('overdue')}`;
      case 'upcoming': return `🗓️ ${tNav('upcoming')}`;
      case 'completed': return `✅ ${tNav('completed')}`;
      default: return tTodo('titleMain');
    }
  };

  const handleClearClick = () => { setIsClearModalOpen(true); };

  // ✅ Cierre instantáneo del modal (sin await)
  const confirmClear = () => { 
      setIsClearModalOpen(false); 
      clearCompleted();           
  };

  // ✅ SOLUCIÓN AL ERROR DE TYPESCRIPT
  // Esta función intermedia asegura que los tipos coincidan exactamente
  const handleAddTodo = (data: { text: string; priority: Priority; dueDate: Date | null }) => {
    addTodo({
      text: data.text,
      priority: data.priority,
      dueDate: data.dueDate
    });
  };

  const showForm = view !== 'completed' && view !== 'overdue';

  const formDefaultDate = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    if (view === 'today') return today;
    if (view === 'upcoming') {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
    }
    return null; 
  }, [view]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <h1 className={styles.title}>{getTitle()}</h1>
            <p className={styles.subtitle}>
               {tTodo('tasksCount', { count: filteredTodos.length })}
            </p>

            {view === 'completed' && filteredTodos.length > 0 && (
                <button 
                    onClick={handleClearClick}
                    style={{
                        fontSize: '0.85rem',
                        padding: '0.4rem 0.8rem',
                        color: '#ef4444', 
                        backgroundColor: 'transparent',
                        border: '1px solid #ef4444',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        marginTop: '0.5rem'
                    }}
                >
                    🗑️ {tTodo('cleanAll')}
                </button>
            )}
        </div>
      </header>

      <div className={styles.contentStack} style={{ gap: showForm ? '2rem' : '1rem' }}>
        {showForm && (
          <TodoForm 
            onSubmit={handleAddTodo} // ✅ Usamos el wrapper corregido aquí
            isLoading={isLoading} 
            defaultDate={formDefaultDate}
            hideControls={view === 'inbox'}
          />
        )}

        <TodoList
          todos={paginatedTodos}
          filter="all" 
          onToggle={toggleTodo}
          onEdit={(todo) => setEditingTodo(todo)}
          onDelete={deleteTodo}
          isLoading={isLoading}
        />
      </div>

      {totalPages > 1 && (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '1rem', 
            marginTop: '2rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--color-border)'
        }}>
            <Button 
                variant="ghost" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
                <ChevronLeft size={20} /> {tPag('prev')}
            </Button>
            
            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                {tPag.rich('info', {
                    current: currentPage,
                    total: totalPages,
                    bold: (chunks) => <strong>{chunks}</strong>
                })}
            </span>

            <Button 
                variant="ghost" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            >
                {tPag('next')} <ChevronRight size={20} />
            </Button>
        </div>
      )}

      {editingTodo && (
        <EditTodoModal 
          isOpen={!!editingTodo}
          onClose={() => setEditingTodo(null)}
          todo={editingTodo}
          onSave={updateTodo}
        />
      )}

      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title={tModals('title')}
        onConfirm={confirmClear}
        confirmText={tModals('confirm')}
        cancelText={tModals('cancel')}
        variant="danger"
      >
        <div style={{ padding: '1.5rem 0', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem' }}>
             {tModals('message')}
          </p>
        </div>
      </Modal>

    </div>
  );
}