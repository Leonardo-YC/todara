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

type TaskToEdit = {
  id: string;
  title: string;
  description: string | null;
  priority: string | null;
  dueDate?: Date | null;
  categoryId?: string | null;
};

export default function TaskDialog({ 
  taskToEdit, 
  categories = [] 
}: { 
  taskToEdit?: TaskToEdit;
  categories?: { id: string, name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    taskToEdit?.dueDate ? new Date(taskToEdit.dueDate) : undefined
  );

  const isEditing = !!taskToEdit;

  async function handleAction(formData: FormData) {
    setLoading(true);
    try {
      // 🔥 Lógica de limpieza para TypeScript
      const rawCategoryId = formData.get('categoryId') as string;
      const rawDescription = formData.get('description') as string;

      const data = {
        title: formData.get('title') as string,
        // Si el string está vacío, mandamos undefined para que Zod no se queje
        description: rawDescription || undefined,
        priority: formData.get('priority') as 'low' | 'medium' | 'high',
        // 🔥 LA CORRECCIÓN: Si es 'none', mandamos undefined en lugar de null
        categoryId: rawCategoryId === 'none' ? undefined : rawCategoryId,
        dueDate: date,
      };

      if (isEditing && taskToEdit?.id) {
        await editTask(taskToEdit.id, data);
        toast.success('Tarea actualizada');
      } else {
        await createTask(data);
        toast.success('Tarea guardada');
      }
      
      setOpen(false);
      if (!isEditing) setDate(undefined);
    } catch (error) {
      console.error(error);
      toast.error('Error al procesar la tarea');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button variant='ghost' size='icon' className='text-zinc-500 hover:text-zinc-900 focus-visible:ring-0'>
            <Pencil className='h-4 w-4' />
          </Button>
        ) : (
          <Button className='w-full sm:w-auto bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'>
            + Nueva Tarea
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className='sm:max-w-[425px] w-[95%] rounded-lg'>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Tarea' : 'Nueva Tarea'}</DialogTitle>
        </DialogHeader>
        
        <form action={handleAction} className='grid gap-4 py-2'>
          <div className='grid gap-2'>
            <Label htmlFor='title'>Título</Label>
            <Input id='title' name='title' defaultValue={taskToEdit?.title} required />
          </div>

          <div className='grid gap-2'>
            <Label>Carpeta / Proyecto</Label>
            <Select name='categoryId' defaultValue={taskToEdit?.categoryId || 'none'}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Sin carpeta' />
              </SelectTrigger>
              <SelectContent className='z-[9999]'>
                <SelectItem value='none'>
                  <div className='flex items-center gap-2'>
                    <Folder className='h-4 w-4 opacity-50' /> 
                    Sin carpeta
                  </div>
                </SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className='flex items-center gap-2'>
                      <Folder className='h-4 w-4' /> 
                      {cat.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='grid gap-2'>
              <Label>Vencimiento</Label>
              <DatePicker date={date} setDate={setDate} />
            </div>
            <div className='grid gap-2'>
              <Label>Prioridad</Label>
              <Select name='priority' defaultValue={taskToEdit?.priority || 'medium'}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='z-[9999]'>
                  <SelectItem value='low'>
                    <div className='flex items-center gap-2'>
                      <Circle className='h-3 w-3 fill-zinc-300 text-zinc-300' /> 
                      Baja
                    </div>
                  </SelectItem>
                  <SelectItem value='medium'>
                    <div className='flex items-center gap-2'>
                      <Circle className='h-3 w-3 fill-blue-500 text-blue-500' /> 
                      Media
                    </div>
                  </SelectItem>
                  <SelectItem value='high'>
                    <div className='flex items-center gap-2'>
                      <Circle className='h-3 w-3 fill-red-500 text-red-500' /> 
                      Alta
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type='submit' disabled={loading} className='w-full mt-2'>
            {loading ? 'Procesando...' : isEditing ? 'Actualizar' : 'Guardar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}