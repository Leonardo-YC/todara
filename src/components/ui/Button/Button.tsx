import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import styles from './Button.module.css'; // Importamos los estilos puros
import { cn } from '@/lib/utils';

// Mapeamos las clases del CSS Module a las variantes
const buttonVariants = cva(styles.root, {
  variants: {
    variant: {
      primary: styles.primary,
      secondary: styles.secondary,
      outline: styles.outline,
      ghost: styles.ghost,
      danger: styles.danger,
    },
    size: {
      sm: styles.sm,
      md: styles.md,
      lg: styles.lg,
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        // Usamos cn() para combinar la clase generada por CVA + className custom
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';