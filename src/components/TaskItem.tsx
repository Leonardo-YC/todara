'use client';

import { useTransition, useOptimistic } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2, Circle } from 'lucide-react'; 
import { toggleTaskCompletion, deleteTask } from '@/actions/tasks-actions';
import TaskDialog from '@/components/TaskDialog'; 
import { toast } from 'sonner';

type TaskProps = {
  id: string;
  title: string;
  description: string | null;
  priority: 'low' | 'medium' | 'high' | string | null;
  isCompleted: boolean | null;
  categoryId?: string | null;
};

export default function TaskItem({ task }: { task: TaskProps }) {
  const [isPending, startTransition] = useTransition();

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
        await toggleTaskCompletion(task.id, !!task.isCompleted);
      } catch (error) {
        toast.error('Error de sincronización');
      }
    });
  };

  return (
    <li className={`flex items-center justify-between rounded-xl border p-3 sm:p-4 shadow-sm transition-all bg-white dark:bg-zinc-950 ${optimisticTask.isCompleted ? 'opacity-60' : ''}`}>
      
      <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
        <Checkbox 
          checked={!!optimisticTask.isCompleted} 
          onCheckedChange={handleToggle}
          disabled={isPending}
          className="h-5 w-5 border-zinc-300"
        />
        
        <div className={`transition-all overflow-hidden ${optimisticTask.isCompleted ? 'line-through' : ''}`}>
          <h4 className="font-medium text-sm sm:text-base truncate">{optimisticTask.title}</h4>
          {optimisticTask.description && (
            <p className="text-xs text-zinc-500 truncate">{optimisticTask.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        {/* 🔥 CORRECCIÓN: Quitamos el "hidden" para que siempre se vea la prioridad */}
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
            {optimisticTask.priority === 'high' ? 'Alta' : optimisticTask.priority === 'medium' ? 'Media' : 'Baja'}
          </span>
        </div>
        
        <TaskDialog taskToEdit={optimisticTask} />
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => startTransition(() => deleteTask(task.id))}
          className="text-zinc-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </li>
  );
}