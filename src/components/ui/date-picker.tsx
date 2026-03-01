'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
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
            'w-full justify-start text-left font-normal transition-all',
            'focus-visible:border-zinc-900 focus-visible:ring-1 focus-visible:ring-zinc-900 dark:focus-visible:border-zinc-300 dark:focus-visible:ring-zinc-300 focus-visible:outline-none',
            'border-zinc-200 dark:border-zinc-800',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4 text-zinc-500' />
          {date ? format(date, 'PPP', { locale: es }) : <span>Seleccionar fecha</span>}
        </Button>
      </PopoverTrigger>
      {/* 🔥 ARREGLO DE POSICIÓN Y TAMAÑO EXACTO: w-[260px] */}
      <PopoverContent 
        side='bottom' 
        sideOffset={4} 
        align='start'
        avoidCollisions={false}
        className='w-[260px] p-3 z-[9999] bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-xl rounded-lg' 
      >
        <Calendar
          mode='single'
          selected={date}
          onSelect={setDate}
          initialFocus
          locale={es}
          className="w-full"
        />
      </PopoverContent>
    </Popover>
  );
}