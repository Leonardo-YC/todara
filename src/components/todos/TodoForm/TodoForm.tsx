'use client';
import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { MAX_TODO_LENGTH } from '@/lib/constants'; 
import { validateTodoText } from '@/utils/validation';
import type { TodoFormData } from '@/types';
import styles from './TodoForm.module.css';

export interface TodoFormProps {
  onSubmit: (data: TodoFormData) => Promise<void>;
  isLoading?: boolean;
}

export const TodoForm: React.FC<TodoFormProps> = ({ onSubmit, isLoading = false }) => {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState<string>('');
  const [error, setError] = useState('');

  const charCount = text.trim().length;
  const isValid = validateTodoText(text);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isValid) {
      setError('Por favor ingresa una tarea válida');
      return;
    }
    try {
      await onSubmit({ text: text.trim(), dueDate: dueDate ? new Date(dueDate) : null });
      setText('');
      setDueDate('');
    } catch (err) {
      setError('Error al crear la tarea.');
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className={styles.form} aria-label="Agregar nueva tarea">
      <div className={styles.inputGroup}>
        <div className={styles.inputWrapper}>
          <Input
            type="text"
            placeholder="¿Qué necesitas hacer?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={MAX_TODO_LENGTH}
            showCharacterCount
            currentLength={charCount}
            error={error}
            disabled={isLoading}
            autoFocus
            aria-label="Nueva tarea"
          />
        </div>
        <Button type="submit" variant="primary" disabled={!isValid || isLoading}>
          {isLoading ? 'Agregando...' : 'Agregar'}
        </Button>
      </div>

      <details>
        <summary className={styles.dateToggle}>
          <span>📅 Agregar fecha límite (opcional)</span>
        </summary>
        <div className={styles.dateInputContainer}>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={today}
            className={styles.dateInput}
          />
          {dueDate && <button type="button" onClick={() => setDueDate('')} className={styles.clearBtn}>Borrar fecha</button>}
        </div>
      </details>
    </form>
  );
};