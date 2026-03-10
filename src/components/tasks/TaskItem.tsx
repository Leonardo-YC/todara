'use client';

import { useTransition, useOptimistic, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2, Circle } from 'lucide-react'; 
import { toggleTaskCompletion, deleteTask } from '@/actions/tasks-actions';
import TaskDialog from '@/components/tasks/TaskDialog'; 
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

type Category = {
  id: string;
  name: string;
  color: string;
};

type TaskProps = {
  id: string;
  title: string;
  description: string | null;
  priority: 'low' | 'medium' | 'high' | string | null;
  isCompleted: boolean | null;
  categoryId?: string | null;
};

export default function TaskItem({ 
  task, 
  categories = [] 
}: { 
  task: TaskProps;
  categories?: Category[]; 
}) {
  const t = useTranslations('TaskDialog');
  // 🔥 Nuevo hook para las traducciones específicas del Item
  const tTasks = useTranslations('TaskItem'); 
  
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);

  const [optimisticTask, setOptimisticTask] = useOptimistic(
    task,
    (state, newCompletedStatus: boolean) => ({
      ...state,
      isCompleted: newCompletedStatus,
    })
  );

  const handleToggle = () => {
    const newStatus = !optimisticTask.isCompleted;
    setOptimisticTask(newStatus);

    startTransition(async () => {
      try {
        const result = await toggleTaskCompletion(task.id, !!task.isCompleted);
        
        if (!result?.success) {
          toast.error(result?.message || t('toastError'));
        }
      } catch (error) {
        toast.error(`❌ ${t('toastConnError')}`);
      }
    });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    // 🔥 Usamos la traducción para el loading ("Eliminando tarea...")
    const toastId = toast.loading(tTasks('toastDeleting')); 
    
    try {
      const result = await deleteTask(task.id);
      if (result?.success) {
        // 🔥 Usamos la traducción para el éxito ("🗑️ Tarea eliminada")
        toast.success(tTasks('toastDeleted'), { id: toastId });
      } else {
        toast.error(`❌ ${result?.message || t('toastError')}`, { id: toastId });
        setIsDeleting(false);
      }
    } catch (e) {
      toast.error(`❌ ${t('toastConnError')}`, { id: toastId });
      setIsDeleting(false);
    }
  };

  return (
    <li className={`flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 p-3 sm:p-4 shadow-sm transition-all duration-300 bg-white dark:bg-zinc-950 ${optimisticTask.isCompleted ? 'opacity-60 bg-zinc-50 dark:bg-zinc-900/50' : ''} ${isDeleting ? 'opacity-0 scale-95' : ''}`}>
      
      <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
        <Checkbox 
          checked={!!optimisticTask.isCompleted} 
          onCheckedChange={handleToggle}
          disabled={isPending || isDeleting}
          className="h-5 w-5 border-zinc-300 dark:border-zinc-700 data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-white dark:data-[state=checked]:text-zinc-900 transition-all"
        />
        
        <div className={`transition-all overflow-hidden ${optimisticTask.isCompleted ? 'line-through text-zinc-400 dark:text-zinc-600' : 'text-zinc-900 dark:text-zinc-100'}`}>
          <h4 className="font-medium text-sm sm:text-base truncate">{optimisticTask.title}</h4>
          {optimisticTask.description && (
            <p className={`text-xs truncate ${optimisticTask.isCompleted ? 'text-zinc-400 dark:text-zinc-600' : 'text-zinc-500 dark:text-zinc-400'}`}>
              {optimisticTask.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <div className={`flex items-center gap-1 sm:gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
          optimisticTask.priority === 'high' ? 'text-red-600 border-red-100 bg-red-50 dark:bg-red-950/30 dark:border-red-900' :
          optimisticTask.priority === 'medium' ? 'text-blue-600 border-blue-100 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-900' :
          'text-zinc-500 border-zinc-100 bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800'
        }`}>
          <Circle className={`h-2 w-2 ${
            optimisticTask.priority === 'high' ? 'fill-red-600' :
            optimisticTask.priority === 'medium' ? 'fill-blue-600' :
            'fill-zinc-400'
          }`} />
          <span className="hidden sm:inline">
            {optimisticTask.priority === 'high' ? t('priorityHigh') : 
             optimisticTask.priority === 'medium' ? t('priorityMedium') : 
             t('priorityLow')}
          </span>
        </div>
        
        <TaskDialog taskToEdit={optimisticTask} categories={categories} />
        
        <Button 
          variant="ghost" 
          size="icon" 
          disabled={isDeleting}
          onClick={handleDelete}
          className="text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors rounded-full"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </li>
  );
}