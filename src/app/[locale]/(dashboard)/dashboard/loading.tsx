export default function DashboardLoading() {
    return (
      <div className="space-y-8 animate-pulse p-2">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
            <div className="h-4 w-64 bg-zinc-100 dark:bg-zinc-900 rounded-lg" />
          </div>
          <div className="h-10 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
        </div>
  
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={i} 
              className="h-32 w-full rounded-[2.5rem] border border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/20" 
            />
          ))}
        </div>
      </div>
    );
  }