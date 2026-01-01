import React from 'react';
import styles from './Checkbox.module.css';
import { cn } from '@/lib/utils';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked, onChange, label, disabled = false, className }, ref) => {
    const checkboxId = React.useId();

    return (
      <label
        htmlFor={checkboxId}
        className={cn(styles.label, disabled && styles.labelDisabled, className)}
      >
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className={styles.input}
        />
        
        <div className={cn(styles.checkboxBox, checked && styles.checked)}>
          <svg
            className={cn(styles.icon, checked && styles.iconVisible)}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {label && <span className={styles.labelText}>{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';