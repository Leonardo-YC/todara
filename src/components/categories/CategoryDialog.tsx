'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, FolderPlus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';

const PRESET_COLORS = [
  { name: 'Zinc', value: '#71717a' },
  { name: 'Rojo', value: '#ef4444' },
  { name: 'Azul', value: '#3b82f6' },
  { name: 'Verde', value: '#22c55e' },
  { name: 'Amarillo', value: '#eab308' },
  { name: 'Violeta', value: '#a855f7' },
];

const categorySchema = z.object({
  name: z.string().min(2), 
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
});

export function CategoryDialog({ 
  onCreate 
}: { 
  onCreate: (data: any) => Promise<{ success: boolean; message: string }> 
}) {
  const t = useTranslations('CategoryDialog');
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0].value);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '', color: selectedColor }
  });

  const onSubmit = async (values: any) => {
    try {
      const result = await onCreate({ ...values, color: selectedColor });
      
      if (result?.success) {
        toast.success(result.message || t('toastSuccess'));
        setOpen(false);
        reset();
      } else {
        toast.error(result?.message || t('toastError'));
      }
    } catch (error) {
      toast.error(t('toastConnError'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-xl shadow-lg hover:shadow-xl transition-all">
          <Plus className="h-4 w-4" />
          {t('new')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] border-zinc-200 dark:border-zinc-800 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 mb-2">
            <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                <FolderPlus className="h-5 w-5" />
            </div>
            <DialogTitle className="text-xl font-bold tracking-tight">{t('title')}</DialogTitle>
          </div>
          <DialogDescription className="font-medium text-zinc-500">
            {t('description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">
              {t('nameLabel')}
            </Label>
            {/* 🔥 FIX: Estilo Boutique con borde rojo si hay error */}
            <Input 
                id="name" 
                placeholder={t('namePlaceholder')}
                {...register('name')} 
                className={`h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 shadow-none transition-colors focus-visible:ring-0 focus-visible:ring-offset-0 ${
                  errors.name 
                    ? 'border-red-500 focus-visible:border-red-500 dark:border-red-900 dark:focus-visible:border-red-500' 
                    : 'border-zinc-200 dark:border-zinc-800 focus-visible:border-zinc-950 dark:focus-visible:border-white'
                }`} 
            />
            {/* 🔥 MENSAJE DE ERROR VISUAL */}
            {errors.name && (
              <p className="text-[10px] font-bold text-red-500 ml-1 uppercase tracking-wider animate-in slide-in-from-top-1">
                {t('nameError')}
              </p>
            )}
          </div>
          
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">
              {t('colorLabel')}
            </Label>
            <div className="flex flex-wrap gap-3 p-1">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`h-8 w-8 rounded-full border-2 transition-all hover:scale-110 active:scale-95 ${
                    selectedColor === color.value ? 'border-zinc-900 dark:border-white ring-2 ring-zinc-200 dark:ring-zinc-800 focus:outline-none' : 'border-transparent opacity-50 hover:opacity-100 focus:outline-none'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="submit" className="w-full rounded-2xl font-black h-14 text-lg bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-all active:scale-[0.98]">
                {t('save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}