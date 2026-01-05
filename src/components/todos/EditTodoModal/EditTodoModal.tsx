'use client';
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl'; // ✅ Importar
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Flag } from 'lucide-react';
import { formatLocalYYYYMMDD } from '@/lib/date-utils';
import type { Todo } from '@/types';
import styles from './EditTodoModal.module.css';

interface EditTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  todo: Todo;
  onSave: (id: string, updates: Partial<Todo>) => void;
}

type Priority = 'low' | 'normal' | 'high';

export function EditTodoModal({ isOpen, onClose, todo, onSave }: EditTodoModalProps) {
  const t = useTranslations('todo'); // Traducciones de tareas
  const tCommon = useTranslations('common'); // Traducciones comunes (Cancelar, Guardar)
  const tPrio = useTranslations('priorities'); // Traducciones de prioridades

  const [text, setText] = useState(todo.text);
  const [priority, setPriority] = useState<Priority>((todo.priority as Priority) || 'normal');
  const [dueDate, setDueDate] = useState(formatLocalYYYYMMDD(todo.dueDate));

  useEffect(() => {
    setText(todo.text);
    setPriority((todo.priority as Priority) || 'normal');
    setDueDate(formatLocalYYYYMMDD(todo.dueDate));
  }, [todo, isOpen]);

  const handleSave = () => {
    const dateToSave = dueDate ? new Date(`${dueDate}T12:00:00`) : null;

    onSave(todo.id, {
      text,
      priority,
      dueDate: dateToSave,
    });
    onClose();
  };

  const priorities: { value: Priority; color: string; label: string }[] = [
    { value: 'high', color: '#ef4444', label: tPrio('high') },
    { value: 'normal', color: '#3b82f6', label: tPrio('normal') },
    { value: 'low', color: '#9ca3af', label: tPrio('low') },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('editTitle')}>
      <div className={styles.container}>
        <Input 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          autoFocus 
        />
        
        <div className={styles.row}>
          <label className={styles.label}>{t('dateLabel')}</label>
          <input 
            type="date" 
            value={dueDate} 
            onChange={(e) => setDueDate(e.target.value)} 
            className={styles.dateInput}
          />
        </div>

        <div className={styles.row}>
          <label className={styles.label}>{tPrio('label')}</label>
          <div className={styles.priorityGroup}>
             {priorities.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={`${styles.flagBtn} ${priority === p.value ? styles.activeFlag : ''}`}
                  style={{ 
                    borderColor: priority === p.value ? p.color : undefined,
                    color: priority === p.value ? p.color : '#6b7280'
                  }}
                >
                  <Flag size={20} fill={priority === p.value ? "currentColor" : "none"} color={p.color} />
                  <span className={styles.flagLabel} style={{ color: p.color }}>{p.label}</span>
                </button>
             ))}
          </div>
        </div>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={onClose}>{tCommon('cancel')}</Button>
          <Button onClick={handleSave}>{t('save')}</Button>
        </div>
      </div>
    </Modal>
  );
}