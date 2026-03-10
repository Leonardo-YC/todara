'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createTask, editTask } from '@/actions/tasks-actions';
import { Pencil, Circle, Folder } from 'lucide-react';
import { toast } from 'sonner';
import { DatePicker } from '@/components/ui/date-picker';
import { useTranslations } from 'next-intl';

type TaskToEdit = {
  id: string;
  title: string;
  description: string | null;
  priority: string | null;
  dueDate?: Date | null;
  categoryId?: string | null;
};

type Category = {
  id: string;
  name: string;
  color: string;
};

export default function TaskDialog({ 
  taskToEdit, 
  categories = [] 
}: { 
  taskToEdit?: TaskToEdit;
  categories?: Category[];
}) {
  const t = useTranslations('TaskDialog');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    taskToEdit?.dueDate ? new Date(taskToEdit.dueDate) : undefined
  );
  
  // 🔥 Nuevo estado para controlar el error del título
  const [titleError, setTitleError] = useState(false);

  const isEditing = !!taskToEdit;

  async function handleAction(formData: FormData) {
    const rawTitle = formData.get('title') as string;
    
    // 🔥 Validación simple: Si tiene menos de 2 letras, mostramos error y detenemos
    if (!rawTitle || rawTitle.trim().length < 2) {
      setTitleError(true);
      return;
    }
    
    setTitleError(false); // Limpiamos el error si pasa
    setLoading(true);
    const toastId = toast.loading(isEditing ? t('toastUpdating') : t('toastSaving'));

    try {
      const data = {
        title: rawTitle.trim(), // Limpiamos espacios
        description: (formData.get('description') as string) || undefined,
        priority: formData.get('priority') as 'low' | 'medium' | 'high',
        categoryId: formData.get('categoryId') === 'none' ? undefined : (formData.get('categoryId') as string),
        dueDate: date,
      };

      const result = isEditing && taskToEdit?.id 
        ? await editTask(taskToEdit.id, data) 
        : await createTask(data);
      
      if (result?.success) {
        toast.success(isEditing ? t('toastUpdated') : t('toastSaved'), { id: toastId });
        setOpen(false);
        if (!isEditing) setDate(undefined);
      } else {
        toast.error(`❌ ${result?.message || t('toastError')}`, { id: toastId });
      }
    } catch (error) {
      toast.error(`❌ ${t('toastConnError')}`, { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) setTitleError(false); // Limpiamos el error al cerrar
    }}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button 
            variant='ghost' 
            size='icon' 
            className='text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all rounded-full focus-visible:ring-0'
          >
            <Pencil className='h-4 w-4' />
          </Button>
        ) : (
          <Button className='w-full sm:w-auto bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 font-bold rounded-xl transition-all active:scale-95'>
            + {t('new')}
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className='sm:max-w-[425px] w-[95%] rounded-[2.5rem] border-zinc-100 dark:border-zinc-800 focus:outline-none shadow-2xl'>
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white">
            {isEditing ? t('edit') : t('new')}
          </DialogTitle>
        </DialogHeader>
        
        <form action={handleAction} className='grid gap-6 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor='title' className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              {t('titleLabel')}
            </Label>
            <Input 
              id='title' 
              name='title' 
              defaultValue={taskToEdit?.title} 
              placeholder={t('titlePlaceholder')} // 🔥 Nuevo placeholder con traducción
              /* 🔥 Estilo de error unificado al de CategoryDialog */
              className={`h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 shadow-none transition-colors focus-visible:ring-0 focus-visible:ring-offset-0 ${
                titleError 
                  ? 'border-red-500 focus-visible:border-red-500 dark:border-red-900 dark:focus-visible:border-red-500' 
                  : 'border-zinc-200 dark:border-zinc-800 focus-visible:border-zinc-950 dark:focus-visible:border-white'
              }`} 
              onChange={() => { if (titleError) setTitleError(false) }} // Limpia error al escribir
            />
            {/* 🔥 Mensaje de error visual para el título */}
            {titleError && (
              <p className="text-[10px] font-bold text-red-500 ml-1 uppercase tracking-wider animate-in slide-in-from-top-1">
                {t('titleError')}
              </p>
            )}
          </div>

          <div className='grid gap-2'>
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              {t('categoryLabel')}
            </Label>
            <Select name='categoryId' defaultValue={taskToEdit?.categoryId || 'none'}>
              <SelectTrigger className='w-full h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-0 focus:border-zinc-950 dark:focus:border-white shadow-none transition-colors'>
                <SelectValue placeholder={t('noCategory')} />
              </SelectTrigger>
              <SelectContent className='z-[9999] rounded-2xl border-zinc-100 dark:border-zinc-800 shadow-xl'>
                <SelectItem value='none' className="rounded-xl">
                  <div className='flex items-center gap-2'>
                    <Folder className='h-4 w-4 opacity-50' /> 
                    {t('noCategory')}
                  </div>
                </SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id} className="rounded-xl">
                    <div className='flex items-center gap-2'>
                      <div className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: cat.color }} />
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">{cat.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='grid grid-cols-2 gap-6'>
            <div className='grid gap-2'>
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                {t('dueDateLabel')}
              </Label>
              <DatePicker date={date} setDate={setDate} />
            </div>
            <div className='grid gap-2'>
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                {t('priorityLabel')}
              </Label>
              <Select name='priority' defaultValue={taskToEdit?.priority || 'medium'}>
                <SelectTrigger className="h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-0 focus:border-zinc-950 dark:focus:border-white shadow-none transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='z-[9999] rounded-2xl border-zinc-100 dark:border-zinc-800 shadow-xl'>
                  <SelectItem value='low' className="rounded-xl">
                    <div className='flex items-center gap-2'>
                      <Circle className='h-3 w-3 fill-zinc-300 text-zinc-300' /> 
                      <span className="font-medium">{t('priorityLow')}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value='medium' className="rounded-xl">
                    <div className='flex items-center gap-2'>
                      <Circle className='h-3 w-3 fill-blue-500 text-blue-500' /> 
                      <span className="font-medium">{t('priorityMedium')}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value='high' className="rounded-xl">
                    <div className='flex items-center gap-2'>
                      <Circle className='h-3 w-3 fill-red-500 text-red-500' /> 
                      <span className="font-medium">{t('priorityHigh')}</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            type='submit' 
            disabled={loading} 
            className='w-full mt-4 h-14 rounded-2xl font-black text-lg bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-all active:scale-[0.97] shadow-xl shadow-zinc-950/10 dark:shadow-none'
          >
            {loading ? t('processing') : isEditing ? t('update') : t('save')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}