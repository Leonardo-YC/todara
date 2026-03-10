import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { Folder, FolderPlus } from 'lucide-react';
import { CategoryDialog } from '@/components/categories/CategoryDialog';
import { CategoryItem } from '@/components/categories/CategoryItem';
import { getUserCategories, createCategory } from '@/actions/categories-actions';
import { getTranslations } from 'next-intl/server';

export default async function CategoriesPage() {
  const t = await getTranslations('Categories');
  const session = await auth();
  
  if (!session) redirect('/signin');

  const realCategories = await getUserCategories();

  async function handleCreateCategory(data: any) {
    'use server';
    return await createCategory(data);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-2 sm:px-0">
      
      {/* CABECERA BOUTIQUE RESPONSIVA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-zinc-50/50 dark:bg-zinc-900/20 p-6 sm:p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800/50 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
          {/* ICONO IDENTITARIO */}
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl sm:rounded-3xl bg-zinc-950 dark:bg-white flex items-center justify-center shadow-xl -rotate-3 shrink-0">
            <Folder className="h-7 w-7 sm:h-8 sm:w-8 text-white dark:text-zinc-950" />
          </div>
          <div className="space-y-1">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-zinc-900 dark:text-white">
              {t('title')}
            </h2>
            <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 font-medium max-w-sm">
              {t('description')}
            </p>
          </div>
        </div>

        {/* BOTÓN DE ACCIÓN (Adaptado al Dialog) */}
        <div className="shrink-0 w-full sm:w-auto">
          <CategoryDialog onCreate={handleCreateCategory} />
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL: GRID DE CATEGORÍAS */}
      {realCategories.length > 0 ? (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {realCategories.map((category) => (
            <CategoryItem 
              key={category.id} 
              category={{
                id: category.id,
                name: category.name,
                color: category.color,
                taskCount: category.taskCount
              }} 
            />
          ))}
        </div>
      ) : (
        /* ESTADO VACÍO REFINADO */
        <div className="flex flex-col items-center justify-center py-24 sm:py-32 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] sm:rounded-[3rem] bg-zinc-50/30 dark:bg-zinc-950/5">
          <div className="h-20 w-20 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-6">
            <FolderPlus className="h-10 w-10 text-zinc-300 dark:text-zinc-700" />
          </div>
          <p className="text-zinc-400 dark:text-zinc-500 font-bold text-center max-w-[240px] leading-tight px-4 uppercase tracking-widest text-xs">
            {t('emptyState')}
          </p>
        </div>
      )}
    </div>
  );
}