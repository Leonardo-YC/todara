export default function TasksLoading() {
    return (
      <div className="space-y-8 pb-10 max-w-5xl mx-auto animate-pulse">
        
        {/* Skeleton del Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between px-2">
          <div className="space-y-3">
            <div className="h-10 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
            <div className="h-5 w-72 bg-zinc-100 dark:bg-zinc-900 rounded-lg" />
          </div>
          <div className="h-14 w-full sm:w-40 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
        </div>
  
        {/* Skeleton de la Tarjeta Principal */}
        <div className="rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8">
          <div className="h-7 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg mb-8" />
          
          {/* Simulamos 4 tareas cargando */}
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/50 bg-zinc-50 dark:bg-zinc-900/20"
              >
                <div className="flex items-center gap-4">
                  {/* Checkbox Skeleton */}
                  <div className="h-5 w-5 rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="space-y-2">
                    {/* Título Skeleton */}
                    <div className="h-4 w-40 sm:w-64 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                    {/* Descripción Skeleton */}
                    <div className="h-3 w-24 sm:w-48 bg-zinc-100 dark:bg-zinc-900 rounded-md" />
                  </div>
                </div>
                <div className="flex gap-2">
                  {/* Prioridad Skeleton */}
                  <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                  {/* Botón Skeleton */}
                  <div className="h-8 w-8 bg-zinc-200 dark:bg-zinc-800 rounded-full hidden sm:block" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }