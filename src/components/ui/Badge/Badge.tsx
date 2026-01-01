import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import styles from './Badge.module.css';
import { cn } from '@/lib/utils';

const badgeVariants = cva(styles.root, {
  variants: {
    variant: {
      default: styles.default,
      secondary: styles.secondary,
      success: styles.success,
      danger: styles.danger,
      outline: styles.outline,
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge: React.FC<BadgeProps> = ({ className, variant, ...props }) => {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
};