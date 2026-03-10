'use client';

import { Folder, MoreVertical, Hash, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { deleteCategory } from '@/actions/categories-actions';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from 'react';
import { useTranslations } from 'next-intl'; 

interface CategoryItemProps {
  category: {
    id: string;
    name: string;
    color: string;
    taskCount?: number;
  };
}

export function CategoryItem({ category }: CategoryItemProps) {
  const t = useTranslations('CategoryItem'); 
  const tActions = useTranslations('Actions.categories'); 
  const tCommon = useTranslations('TaskDialog'); 
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const toastId = toast.loading(t('toastDeleting'));
    
    try {
      const result = await deleteCategory(category.id);
      
      if (result?.success) {
        toast.success(t('toastDeleted', { name: category.name }), { id: toastId });
      } else {
        toast.error(`❌ ${result?.message || tActions('deleteError')}`, { id: toastId });
        setIsDeleting(false);
      }
    } catch (e) {
      toast.error(`❌ ${tCommon('toastConnError')}`, { id: toastId });
      setIsDeleting(false);
    }
  };

  return (
    <Card className={`group relative border-zinc-200 dark:border-zinc-800 hover:shadow-xl transition-all duration-300 overflow-hidden bg-white dark:bg-zinc-950 rounded-[2rem] ${isDeleting ? 'opacity-50 scale-95' : ''}`}>
      {/* Barra de color superior */}
      <div 
        className="absolute top-0 left-0 w-full h-2 transition-all duration-300 group-hover:h-3" 
        style={{ backgroundColor: category.color }} 
      />
      
      <CardContent className="p-6 pt-8">
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            {/* Icono con fondo suave */}
            <div 
              className="h-12 w-12 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-sm"
              style={{ backgroundColor: `${category.color}15`, color: category.color }}
            >
              <Folder className="h-6 w-6 fill-current" />
            </div>
            
            <div>
              <h3 className="font-black text-xl text-zinc-900 dark:text-zinc-100 tracking-tight">
                {category.name}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 mt-1 font-medium">
                <Hash className="h-3.5 w-3.5" />
                {category.taskCount || 0} {t('tasksCount', { count: category.taskCount || 0 })}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {/* 🔥 FIX: Limpieza total del focus con outline-none, ring-0 y offset-0 */}
              <Button 
                variant="ghost" 
                size="icon" 
                disabled={isDeleting}
                className="rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-900 dark:hover:text-zinc-100 transition-colors focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-transparent"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl border-zinc-100 dark:border-zinc-800 shadow-xl">
              <DropdownMenuItem 
                onClick={handleDelete}
                className="cursor-pointer gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30 rounded-lg font-bold"
              >
                <Trash2 className="h-4 w-4" />
                {t('delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}