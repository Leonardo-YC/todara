'use client';

import React from 'react';
import { Checkbox } from '@/components/ui/Checkbox';
import { Flag, Edit2, Trash2 } from 'lucide-react';
import { formatFriendlyDate, isOverdue } from '@/lib/date-utils';
import { cn } from '@/lib/utils';
import type { Todo } from '@/types'; // ✅ Importamos solo el tipo base Todo
import styles from './TodoItem.module.css';

// ✅ Definimos y EXPORTAMOS la interfaz aquí mismo
export interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export const TodoItem = ({ todo, onToggle, onEdit, onDelete }: TodoItemProps) => {
  
  const priorityColors: Record<string, string> = {
    high: '#ef4444',   // Rojo
    normal: '#3b82f6', // Azul
    low: '#9ca3af'     // Gris
  };

  const isLate = isOverdue(todo.dueDate) && !todo.completed;
  
  // Obtenemos el color actual
  const flagColor = todo.priority ? priorityColors[todo.priority] : priorityColors.normal;

  return (
    <li className={cn(styles.item, todo.completed && styles.completed)}>
      <div className={styles.checkWrapper}>
        <Checkbox
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <p className={styles.text}>{todo.text}</p>
          
          {/* Solo mostramos la bandera si NO es normal */}
          {todo.priority && todo.priority !== 'normal' && (
             <Flag 
               size={16} 
               style={{ color: flagColor, fill: 'currentColor' }} 
             />
          )}
        </div>
        
        <div className={styles.meta}>
           {todo.dueDate && (
             <span className={cn(styles.date, isLate && styles.overdue)}>
                {isLate && '⚠️ '} 
                {formatFriendlyDate(todo.dueDate)}
             </span>
           )}
        </div>
      </div>

      <div className={styles.actions}>
        <button onClick={() => onEdit(todo)} className={styles.actionBtn}>
          <Edit2 size={16} />
        </button>
        <button onClick={() => onDelete(todo.id)} className={styles.actionBtn}>
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  );
};