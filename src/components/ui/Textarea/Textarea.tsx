import React from 'react';
import styles from './Textarea.module.css';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  showCharacterCount?: boolean;
  currentLength?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, showCharacterCount, currentLength = 0, maxLength, ...props }, ref) => {
    const id = React.useId();
    
    return (
      <div className={styles.container}>
        {label && <label htmlFor={id} className={styles.label}>{label}</label>}
        
        <div className={styles.wrapper}>
          <textarea
            ref={ref}
            id={id}
            className={cn(styles.textarea, error && styles.errorBorder, className)}
            maxLength={maxLength}
            {...props}
          />
          {showCharacterCount && maxLength && (
            <div className={styles.counter}>
              {currentLength} / {maxLength}
            </div>
          )}
        </div>
        
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';