import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserTasks } from '@/actions/tasks-actions'; 
import { getUserCategories } from '@/actions/categories-actions'; // 🔥 Importación necesaria
import TaskDialog from '@/components/tasks/TaskDialog'; 
import TaskItem from '@/components/tasks/TaskItem';
import { getTranslations } from 'next-intl/server';
import { ListTodo, CheckCircle } from 'lucide-react';

export default async function TasksPage() {
  const t = await getTranslations('Tasks');
  
  // 📡 Obtenemos tareas y carpetas en paralelo desde Neon
  const [tasks, categories] = await Promise.all([
    getUserTasks(),
    getUserCategories()
  ]);

  const pendingTasks = tasks.filter((task) => !task.isCompleted);
  const completedTasks = tasks.filter((task) => task.isCompleted);

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-2 sm:px-0">
      
      {/* HEADER BOUTIQUE UNIFICADO */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-zinc-50/50 dark:bg-zinc-900/20 p-6 sm:p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800/50 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl sm:rounded-3xl bg-zinc-950 dark:bg-white flex items-center justify-center shadow-xl rotate-3 shrink-0">
            <ListTodo className="h-7 w-7 sm:h-8 sm:w-8 text-white dark:text-zinc-950" />
          </div>
          <div className="space-y-1">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-zinc-900 dark:text-white leading-none">
              {t('title')}
            </h2>
            <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 font-medium">
              {t('description', { count: pendingTasks.length })}
            </p>
          </div>
        </div>
        
        {/* 🔥 PASAMOS CARPETAS REALES AL DIALOG */}
        <div className="w-full sm:w-auto shrink-0">
          <TaskDialog categories={categories} />
        </div>
      </div>

      <div className="grid gap-8 sm:gap-10">
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/10 dark:shadow-none bg-white dark:bg-zinc-950 rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden">
          <CardHeader className="px-6 sm:px-10 pt-8 pb-4">
            <CardTitle className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
              {t('inboxTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-10 pb-10">
            {pendingTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 sm:py-20 rounded-[2rem] border-2 border-dashed border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/30 transition-colors">
                <div className="h-16 w-16 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center shadow-sm mb-4">
                  <CheckCircle className="h-8 w-8 text-zinc-200 dark:text-zinc-800" />
                </div>
                <p className="text-base font-bold text-zinc-900 dark:text-white">{t('emptyTitle')}</p>
                <p className="text-sm text-zinc-500 font-medium mt-1">{t('emptySubtitle')}</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {pendingTasks.map((task) => (
                  <TaskItem key={task.id} task={task} categories={categories} />
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {completedTasks.length > 0 && (
          <Card className="border-none bg-zinc-50/50 dark:bg-zinc-900/10 rounded-[2.5rem] sm:rounded-[3rem]">
            <CardHeader className="px-6 sm:px-10 pt-8 pb-4">
              <CardTitle className="text-lg sm:text-xl font-bold text-zinc-400 dark:text-zinc-600 flex items-center gap-3">
                <CheckCircle className="h-5 w-5" />
                {t('completedTitle', { count: completedTasks.length })}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-10 pb-10">
              <ul className="space-y-4 opacity-60">
                {completedTasks.map((task) => (
                  <TaskItem key={task.id} task={task} categories={categories} />
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}