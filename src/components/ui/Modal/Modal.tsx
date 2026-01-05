import React, { useEffect, useRef } from 'react';
import styles from './Modal.module.css';
import { Button } from '../Button/Button';
import { useTranslations } from 'next-intl';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  variant?: 'default' | 'danger';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen, onClose, title, children, confirmText, cancelText, onConfirm, variant = 'default'
}) => {
  const t = useTranslations('common');

  const finalConfirmText = confirmText || t('confirm');
  const finalCancelText = cancelText || t('cancel');

  useEffect(() => {
    if (!isOpen) return;

    // 1. Calculamos cuánto mide la barra de scroll antes de quitarla
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    // 2. Guardamos el estilo original para restaurarlo luego
    const originalStyle = window.getComputedStyle(document.body).overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // 3. Bloqueamos el scroll y AÑADIMOS PADDING para compensar la desaparición de la barra
    document.body.style.overflow = 'hidden';
    
    // Solo añadimos el padding si realmente había una barra de scroll
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      
      // 4. Restauramos todo como estaba al cerrar
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.modal} role="dialog" aria-modal="true">
        
        {/* Header limpio */}
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </div>
        
        <div className={styles.content}>{children}</div>
        
        <div className={styles.footer}>
          <Button variant="ghost" onClick={onClose}>{finalCancelText}</Button>
          {onConfirm && (
            <Button variant={variant === 'danger' ? 'danger' : 'primary'} onClick={onConfirm}>
              {finalConfirmText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};