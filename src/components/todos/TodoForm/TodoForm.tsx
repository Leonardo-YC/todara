'use client';
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl'; // ✅ Importar
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Flag, Calendar } from 'lucide-react';
import { formatLocalYYYYMMDD } from '@/lib/date-utils';
import styles from './TodoForm.module.css';

export const TodoForm = ({ onSubmit, isLoading, defaultDate, hideControls = false }: any) => {
  const t = useTranslations('todo'); // ✅ Traducciones de Todo
  const tPrio = useTranslations('priorities'); // ✅ Traducciones de Prioridades

  const [text, setText] = useState('');
  const [priority, setPriority] = useState('normal'); 
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (defaultDate) {
      setDueDate(formatLocalYYYYMMDD(defaultDate));
    } else {
      setDueDate('');
    }
  }, [defaultDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    const finalPriority = hideControls ? 'normal' : priority;
    const finalDate = (hideControls || !dueDate) ? null : new Date(`${dueDate}T12:00:00`);

    onSubmit({
      text: text.trim(),
      priority: finalPriority,
      dueDate: finalDate,
    });
    setText('');
    setPriority('normal');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.mainInput}>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('addPlaceholder')} // "Qué necesitas hacer?" / "What needs to be done?"
          disabled={isLoading}
          autoFocus
        />
        <Button type="submit" disabled={!text || isLoading}>
          {isLoading ? t('adding') : t('addButton')}
        </Button>
      </div>

      {!hideControls && (
        <div className={styles.controls}>
          <div className={styles.dateControl}>
            <Calendar size={16} className={styles.icon} />
            <input 
              type="date" 
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={styles.dateInput}
            />
          </div>

          <div className={styles.priorityGroup}>
            {[
              { value: 'high', color: '#ef4444', label: tPrio('high') },
              { value: 'normal', color: '#3b82f6', label: tPrio('normal') },
              { value: 'low', color: '#9ca3af', label: tPrio('low') },
            ].map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPriority(p.value)}
                className={`${styles.flagBtn} ${priority === p.value ? styles.activeFlag : ''}`}
                title={p.label}
                style={{ color: p.color }}
              >
                <Flag size={18} fill={priority === p.value ? "currentColor" : "none"} />
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
};