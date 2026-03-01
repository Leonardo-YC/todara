import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserTasks } from '@/actions/tasks-actions'; 
import TaskDialog from '@/components/TaskDialog'; 
import TaskItem from '@/components/TaskItem';

export default async function TasksPage() {
  const tasks = await getUserTasks();

  const pendingTasks = tasks.filter((task) => !task.isCompleted);
  const completedTasks = tasks.filter((task) => task.isCompleted);

  return (
    <div className="space-y-6 pb-10">
      {/* Header responsivo: Se apila en pantallas muy pequeñas */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Mis Tareas</h2>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
            Gestiona tu productividad. Tienes <span className="font-semibold text-zinc-900 dark:text-zinc-100">{pendingTasks.length}</span> pendientes.
          </p>
        </div>
        
        {/* El botón de Nueva Tarea se ajusta al ancho en móvil */}
        <div className="w-full sm:w-auto">
          <TaskDialog />
        </div>
      </div>

      <div className="grid gap-6">
        {/* 🟢 SECCIÓN 1: PENDIENTES */}
        <Card className="border-none shadow-none sm:border sm:shadow-sm">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-xl">Bandeja de Entrada</CardTitle>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            {pendingTasks.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
                <span className="text-4xl mb-2">📋</span>
                <p className="text-sm font-medium">No hay tareas pendientes</p>
                <p className="text-xs text-zinc-500">¡Todo al día!</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {pendingTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* ⚪ SECCIÓN 2: COMPLETADAS */}
        {completedTasks.length > 0 && (
          <Card className="opacity-80 bg-zinc-50/50 dark:bg-zinc-900/20 border-dashed shadow-none">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-lg text-zinc-500">
                Completadas ({completedTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <ul className="space-y-3">
                {completedTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}