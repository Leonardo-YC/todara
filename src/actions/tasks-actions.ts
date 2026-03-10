'use server';

import { db } from '@/lib/db';
import { tasks } from '@/lib/db/schema'; 
import { auth } from '@/lib/auth/auth';
import { insertTaskSchema, InsertTaskData } from '@/core/validators/tasks';
import { revalidatePath } from 'next/cache';
import { eq, desc, and } from 'drizzle-orm'; 
import { getTranslations } from 'next-intl/server';

export async function createTask(data: InsertTaskData) {
  const t = await getTranslations('Actions');
  const tDiag = await getTranslations('TaskDialog');
  const session = await auth();
  
  if (!session?.user?.id) return { success: false, message: t('unauthorized') };

  const parsedData = insertTaskSchema.safeParse(data);
  if (!parsedData.success) return { success: false, message: t('invalidData') };

  try {
    await db.insert(tasks).values({
      title: parsedData.data.title,
      description: parsedData.data.description,
      priority: parsedData.data.priority,
      dueDate: parsedData.data.dueDate,
      categoryId: parsedData.data.categoryId,
      userId: session.user.id,
      isCompleted: false, 
    });

    revalidatePath('/', 'layout');
    return { success: true, message: tDiag('toastSaved') };
  } catch (error) {
    console.error('Error al crear tarea:', error);
    return { success: false, message: t('tasks.createError') };
  }
}

export async function toggleTaskCompletion(taskId: string, currentStatus: boolean) {
  const t = await getTranslations('Actions');
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: t('unauthorized') };

  try {
    await db.update(tasks)
      .set({ isCompleted: !currentStatus })
      .where(eq(tasks.id, taskId));

    revalidatePath('/', 'layout');
    return { success: true, message: t('success') };
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    return { success: false, message: t('tasks.updateError') };
  }
}

export async function deleteTask(taskId: string) {
  const t = await getTranslations('Actions');
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: t('unauthorized') };

  try {
    await db.delete(tasks).where(eq(tasks.id, taskId));
    revalidatePath('/', 'layout');
    return { success: true, message: t('success') };
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    return { success: false, message: t('tasks.deleteError') };
  }
}

export async function editTask(taskId: string, data: any) {
  const t = await getTranslations('Actions');
  const tDiag = await getTranslations('TaskDialog');
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: t('unauthorized') };

  try {
    await db.update(tasks)
      .set({ 
        ...data, 
        updatedAt: new Date() 
      })
      .where(eq(tasks.id, taskId));

    revalidatePath('/', 'layout');
    return { success: true, message: tDiag('toastUpdated') };
  } catch (error) {
    console.error('Error al editar tarea:', error);
    return { success: false, message: t('tasks.updateError') };
  }
}

export async function getUserTasks() {
  const session = await auth();
  if (!session?.user?.id) return [];
  try {
    return await db.select().from(tasks).where(eq(tasks.userId, session.user.id)).orderBy(desc(tasks.createdAt));
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    return [];
  }
}

export async function getMascotStatus() {
  const session = await auth();
  if (!session?.user?.id) return 'neutral';
  try {
    const pending = await db.select().from(tasks).where(and(eq(tasks.userId, session.user.id), eq(tasks.isCompleted, false)));
    const overdue = pending.filter(t => t.dueDate && new Date(t.dueDate) < new Date());
    if (pending.length === 0) return 'happy'; 
    if (overdue.length > 0 || pending.length > 5) return 'alert'; 
    return 'neutral';
  } catch (error) {
    return 'neutral';
  }
}