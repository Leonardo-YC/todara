'use server';

import { db } from '@/lib/db';
import { tasks } from '@/lib/db/schema'; 
import { auth } from '@/lib/auth';
import { insertTaskSchema, InsertTaskData } from '@/core/validators/tasks';
import { revalidatePath } from 'next/cache';
import { eq, desc } from 'drizzle-orm'; 

export async function createTask(data: InsertTaskData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('No autorizado.');

  const parsedData = insertTaskSchema.safeParse(data);
  if (!parsedData.success) throw new Error('Datos inválidos.');

  try {
    await db.insert(tasks).values({
      title: parsedData.data.title,
      description: parsedData.data.description,
      priority: parsedData.data.priority,
      dueDate: parsedData.data.dueDate,
      categoryId: parsedData.data.categoryId, // ✅ Ahora se guarda la carpeta
      userId: session.user.id,
      isCompleted: false, 
    });

    revalidatePath('/es/dashboard/tasks');
    return { success: true };
  } catch (error) {
    console.error('Error al crear tarea:', error);
    throw new Error('No se pudo guardar la tarea.');
  }
}

export async function getUserTasks() {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    const myTasks = await db.select()
      .from(tasks)
      .where(eq(tasks.userId, session.user.id))
      .orderBy(desc(tasks.createdAt));

    return myTasks;
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    return [];
  }
}

export async function toggleTaskCompletion(taskId: string, currentStatus: boolean) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('No autorizado');

  try {
    await db.update(tasks)
      .set({ isCompleted: !currentStatus })
      .where(eq(tasks.id, taskId));

    revalidatePath('/es/dashboard/tasks');
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    throw new Error('No se pudo actualizar el estado de la tarea.');
  }
}

export async function deleteTask(taskId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('No autorizado');

  try {
    await db.delete(tasks)
      .where(eq(tasks.id, taskId));

    revalidatePath('/es/dashboard/tasks');
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    throw new Error('No se pudo eliminar la tarea.');
  }
}

// 🔥 ACTUALIZADA: Ahora recibe categoryId
export async function editTask(
  taskId: string, 
  data: { 
    title: string; 
    description?: string; 
    priority: 'low' | 'medium' | 'high';
    dueDate?: Date | null;
    categoryId?: string | null;
  }
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('No autorizado');

  try {
    await db.update(tasks)
      .set({
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate,
        categoryId: data.categoryId, // ✅ Actualiza la carpeta
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, taskId));

    revalidatePath('/es/dashboard/tasks');
    return { success: true };
  } catch (error) {
    console.error('Error al editar tarea:', error);
    throw new Error('No se pudo editar la tarea.');
  }
}