'use client';

import { CheckCircle2, AlertCircle, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isToday, isTomorrow, isPast, isWithinInterval, addDays, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from 'next-intl'; // 🔥 Importamos traducciones

interface Task {
  id: string;
  title: string;
  dueDate: Date | null;
  priority: 'low' | 'medium' | 'high' | null;
  isCompleted: boolean | null;
}

export function CalendarTimeline({ tasks }: { tasks: Task[] }) {
  const t = useTranslations('Calendar'); // 🔥 Hook de traducción
  const today = startOfDay(new Date());
  
  // Filtros de tiempo inteligentes
  const overdue = tasks.filter(t => t.dueDate && isPast(t.dueDate) && !isToday(t.dueDate) && !t.isCompleted);
  const forToday = tasks.filter(t => t.dueDate && isToday(t.dueDate));
  const forTomorrow = tasks.filter(t => t.dueDate && isTomorrow(t.dueDate));
  const thisWeek = tasks.filter(t => 
    t.dueDate && 
    isWithinInterval(t.dueDate, { 
      start: addDays(today, 2), 
      end: addDays(today, 7) 
    })
  );

  const Section = ({ title, icon: Icon, data, colorClass }: any) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <div className={cn("p-1.5 rounded-lg shrink-0", colorClass)}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        {/* Título de sección traducido */}
        <h3 className="font-bold text-[11px] uppercase tracking-[0.15em] text-zinc-400 dark:text-white">
          {title}
        </h3>
        <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-white px-2 py-0.5 rounded-full font-black">
          {data.length}
        </span>
      </div>
      
      <div className="grid gap-2.5">
        {data.length > 0 ? (
          data.map((task: Task) => (
            <Card key={task.id} className="border-zinc-200 dark:border-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all bg-white dark:bg-zinc-950/50 overflow-hidden rounded-2xl shadow-sm group">
              <CardContent className="p-3 sm:p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className={cn(
                    "h-2.5 w-2.5 rounded-full shadow-sm shrink-0",
                    task.priority === 'high' ? "bg-red-500" : task.priority === 'medium' ? "bg-blue-500" : "bg-zinc-300"
                  )} />
                  <div className="space-y-0.5">
                    {/* Título: Blanco puro en Dark Mode */}
                    <p className={cn(
                      "font-bold text-sm sm:text-base tracking-tight transition-colors",
                      task.isCompleted 
                        ? "line-through text-zinc-400 dark:text-zinc-600" 
                        : "text-zinc-900 dark:text-white"
                    )}>
                      {task.title}
                    </p>
                    {task.dueDate && (
                      <p className="text-xs text-zinc-400 dark:text-zinc-400 flex items-center gap-1.5 font-medium">
                        <Clock className="h-3 w-3" />
                        {format(task.dueDate, "d 'de' MMMM", { locale: es })}
                      </p>
                    )}
                  </div>
                </div>
                {task.isCompleted && (
                  <div className="bg-green-50 dark:bg-green-950/30 p-1 rounded-full">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          /* Mensaje de sección vacía traducido */
          <p className="text-[11px] text-zinc-400 dark:text-zinc-600 italic px-4 py-2 border border-dashed border-zinc-100 dark:border-zinc-900 rounded-xl">
            {t('noTasksInSection')}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="grid gap-8">
      {/* Usamos las llaves del JSON para los títulos */}
      <Section 
        title={t('overdue')} 
        icon={AlertCircle} 
        data={overdue} 
        colorClass="bg-red-50 text-red-600 dark:bg-red-950/20" 
      />
      <Section 
        title={t('today')} 
        icon={Clock} 
        data={forToday} 
        colorClass="bg-blue-50 text-blue-600 dark:bg-blue-950/20" 
      />
      <Section 
        title={t('upcoming')} 
        icon={CalendarIcon} 
        data={[...forTomorrow, ...thisWeek]} 
        colorClass="bg-zinc-100 text-zinc-600 dark:bg-zinc-800" 
      />
    </div>
  );
}