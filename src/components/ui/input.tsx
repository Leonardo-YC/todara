import * as React from 'react';
import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Estilos base de estructura
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 h-9 w-full min-w-0 bg-transparent px-3 py-1 text-base shadow-xs transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        
        // 🧱 BORDE BASE: Muy sutil
        'rounded-md border border-zinc-200 dark:border-zinc-800',
        
        // 🔥 FOCUS LEVE BOUTIQUE: Solo cambio de color de borde, cero anillo
        'focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none', 
        'focus-visible:border-zinc-900 dark:focus-visible:border-zinc-300', 

        // Estado inválido
        'aria-invalid:border-destructive',
        className
      )}
      {...props}
    />
  );
}

export { Input };