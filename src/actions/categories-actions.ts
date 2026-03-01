'use server';

import { db } from '@/lib/db';
import { categories } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { insertCategorySchema, InsertCategoryData } from '@/core/validators/categories';
import { revalidatePath } from 'next/cache';
import { eq, desc } from 'drizzle-orm';

// --- 1. CREAR CATEGORÍA ---
export async function createCategory(data: InsertCategoryData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('No autorizado.');

  const parsedData = insertCategorySchema.safeParse(data);
  if (!parsedData.success) throw new Error('Datos de carpeta inválidos.');

  try {
    await db.insert(categories).values({
      name: parsedData.data.name,
      color: parsedData.data.color,
      userId: session.user.id,
    });

    revalidatePath('/es/dashboard/tasks');
    revalidatePath('/es/dashboard/categories');
    return { success: true };
  } catch (error) {
    console.error('Error al crear categoría:', error);
    throw new Error('No se pudo crear la carpeta.');
  }
}

// --- 2. LEER CATEGORÍAS (Obtener todas las del usuario) ---
export async function getUserCategories() {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    const myCategories = await db.select()
      .from(categories)
      .where(eq(categories.userId, session.user.id))
      .orderBy(desc(categories.name));

    return myCategories;
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return [];
  }
}

// --- 3. EDITAR CATEGORÍA ---
export async function updateCategory(categoryId: string, data: InsertCategoryData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('No autorizado.');

  try {
    await db.update(categories)
      .set({
        name: data.name,
        color: data.color,
      })
      .where(eq(categories.id, categoryId));

    revalidatePath('/es/dashboard/tasks');
    revalidatePath('/es/dashboard/categories');
    return { success: true };
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    throw new Error('No se pudo actualizar la carpeta.');
  }
}

// --- 4. ELIMINAR CATEGORÍA ---
export async function deleteCategory(categoryId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('No autorizado.');

  try {
    await db.delete(categories)
      .where(eq(categories.id, categoryId));

    revalidatePath('/es/dashboard/tasks');
    revalidatePath('/es/dashboard/categories');
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    throw new Error('No se pudo eliminar la carpeta.');
  }
}