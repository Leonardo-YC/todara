'use client';
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { isOverdue, getRelativeTime } from '@/utils/date-format';
import { validateTodoText } from '@/utils/validation';
import { getAriaLabel } from '@/lib/constants/aria-labels';
import { cn } from '@/lib/utils';
import type { Todo } from '@/types';
import styles from './TodoItem.module.css';

export interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  locale?: 'en' | 'es';
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onEdit, onDelete, locale = 'es' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = () => {
    if (validateTodoText(editText)) {
      onEdit(todo.id, editText.trim());
      setIsEditing(false);
    }
  };

  const isDueDateOverdue = todo.dueDate ? isOverdue(todo.dueDate) : false;

  return (
    <>
      <li className={styles.item}>
        <div style={{ paddingTop: '0.25rem' }}>
          <Checkbox
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            aria-label={getAriaLabel.markComplete(todo.text, todo.completed)}
          />
        </div>

        <div className={styles.content}>
          {isEditing ? (
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              autoFocus
            />
          ) : (
            <div>
              <p className={cn(styles.text, todo.completed && styles.completedText)}>
                {todo.text}
              </p>
              {todo.dueDate && (
                <div className={styles.meta}>
                  <Badge variant={isDueDateOverdue ? 'danger' : 'default'}>
                    {isDueDateOverdue && '⚠️ '}
                    {getRelativeTime(todo.dueDate, locale)}
                  </Badge>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.actions}>
           {!isEditing && (
             <>
               <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>✏️</Button>
               <Button variant="ghost" size="sm" onClick={() => setIsDeleting(true)}>🗑️</Button>
             </>
           )}
        </div>
      </li>

      <Modal
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        title="¿Eliminar tarea?"
        variant="danger"
        confirmText="Eliminar"
        onConfirm={() => onDelete(todo.id)}
      >
        <p>¿Estás seguro de que quieres eliminar "<strong>{todo.text}</strong>"?</p>
      </Modal>
    </>
  );
};