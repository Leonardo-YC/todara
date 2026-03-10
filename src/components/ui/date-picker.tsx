'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale'; // 🔥 IMPORTANTE: Asegúrate de que esté importado
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export function DatePicker({ 
  date, 
  setDate 
}: { 
  date?: Date; 
  setDate: (date?: Date) => void 
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full h-12 justify-start text-left font-medium transition-all rounded-2xl px-4',
            'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900',
            'focus-visible:ring-0 focus-visible:border-zinc-900 dark:focus-visible:border-zinc-300 focus-visible:outline-none',
            !date && 'text-zinc-400'
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4 text-zinc-400 shrink-0' />
          <span className="truncate">
            {/* 🔥 FORMATO Y LOCALE: Para que el texto del botón también esté en español */}
            {date ? format(date, 'dd/MM/yyyy', { locale: es }) : <span>Seleccionar</span>}
          </span>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        side='bottom' 
        sideOffset={6} 
        align='start'
        className='w-[260px] p-2 z-[9999] bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-[1.5rem]' 
      >
        <Calendar
          mode='single'
          selected={date}
          onSelect={setDate}
          initialFocus
          locale={es} // 🔥 TRADUCCIÓN: Esto traduce los meses y días dentro del calendario
          className="w-full"
        />
      </PopoverContent>
    </Popover>
  );
}