import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { CalendarTimeline } from '@/components/calendar/CalendarTimeline';
import { getUserTasks } from '@/actions/tasks-actions';
import { CalendarDays } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function CalendarPage() {
  const t = await getTranslations('Calendar');
  const session = await auth();
  
  if (!session) redirect('/signin');

  // 📡 Obtenemos tareas reales de Neon
  const allTasks = await getUserTasks();
  
  // 🧹 Limpieza y tipado de datos para el componente
  const tasksForCalendar = allTasks
    .filter(t => t.dueDate !== null) 
    .map(t => ({
      id: t.id,
      title: t.title,
      dueDate: t.dueDate ? new Date(t.dueDate) : null,
      priority: t.priority as 'low' | 'medium' | 'high' | null,
      isCompleted: t.isCompleted,
    }));

  return (
    /* Reducimos space-y de 10 a 6 para compactar */
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10 px-2 sm:px-0">
      
      {/* CABECERA MÁS COMPACTA Y CON ALTO CONTRASTE */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
        <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-[1.5rem] sm:rounded-3xl bg-zinc-950 dark:bg-white flex items-center justify-center shadow-xl rotate-3 shrink-0">
          <CalendarDays className="h-7 w-7 sm:h-8 sm:w-8 text-white dark:text-zinc-950" />
        </div>
        <div className="space-y-0.5">
          {/* Texto White puro en Dark Mode para legibilidad */}
          <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-zinc-900 dark:text-white">
            {t('title')}
          </h2>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-300 font-medium max-w-md">
            {t('description')}
          </p>
        </div>
      </div>

      {/* CONTENEDOR DEL CALENDARIO: Padding reducido de p-8 a p-6 */}
      <div className="bg-zinc-100/40 dark:bg-zinc-900/40 p-4 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] border border-zinc-200/60 dark:border-zinc-800 shadow-inner overflow-hidden">
        <CalendarTimeline tasks={tasksForCalendar} />
      </div>

      {/* ESTADO VACÍO REFINADO */}
      {tasksForCalendar.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 select-none border-2 border-dashed border-zinc-100 dark:border-zinc-900 rounded-[2rem]">
          <CalendarDays className="h-10 w-10 mb-3 text-zinc-300 dark:text-zinc-700" />
          <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600">
            {t('emptyState')}
          </p>
        </div>
      )}
    </div>
  );
}