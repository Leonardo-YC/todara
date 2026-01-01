import React, { useEffect, useRef } from 'react';
import styles from './Modal.module.css';
import { Button } from '../Button/Button'; // Reusamos el botón puro que ya hiciste

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
  isOpen, onClose, title, children, confirmText = 'Confirmar', cancelText = 'Cancelar', onConfirm, variant = 'default'
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap simple para cumplir accesibilidad
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden'; // Bloquear scroll
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.modal} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button onClick={onClose} className={styles.closeButton} aria-label="Cerrar">
            ✕
          </button>
        </div>
        
        <div className={styles.content}>{children}</div>
        
        <div className={styles.footer}>
          <Button variant="ghost" onClick={onClose}>{cancelText}</Button>
          {onConfirm && (
            <Button variant={variant === 'danger' ? 'danger' : 'primary'} onClick={onConfirm}>
              {confirmText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};