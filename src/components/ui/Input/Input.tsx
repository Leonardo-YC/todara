import React from 'react';
import styles from './Input.module.css';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  showCharacterCount?: boolean;
  currentLength?: number;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, showCharacterCount, currentLength = 0, maxLength, ...props }, ref) => {
    const inputId = React.useId();
    const isApproachingLimit = showCharacterCount && maxLength && currentLength >= maxLength * 0.9;

    return (
      <div className={styles.container}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        
        <div className={styles.inputWrapper}>
          <input
            ref={ref}
            id={inputId}
            className={cn(styles.input, error && styles.inputError, className)}
            maxLength={maxLength}
            aria-invalid={!!error}
            {...props}
          />
          
          {showCharacterCount && maxLength && (
            <div className={cn(styles.counter, isApproachingLimit && styles.counterWarning)}>
              {currentLength} / {maxLength}
            </div>
          )}
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';