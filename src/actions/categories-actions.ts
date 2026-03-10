'use server';

import { db } from '@/lib/db';
import { categories, tasks } from '@/lib/db/schema';
import { auth } from '@/lib/auth/auth';
import { insertCategorySchema, InsertCategoryData } from '@/core/validators/categories';
import { revalidatePath } from 'next/cache';
import { eq, desc, sql } from 'drizzle-orm';
import { getTranslations } from 'next-intl/server';

export async function createCategory(data: InsertCategoryData) {
  const t = await getTranslations('Actions');
  const tDiag = await getTranslations('CategoryDialog');
  const session = await auth();
  
  if (!session?.user?.id) return { success: false, message: t('unauthorized') };

  const parsedData = insertCategorySchema.safeParse(data);
  if (!parsedData.success) return { success: false, message: t('invalidData') };

  try {
    await db.insert(categories).values({
      name: parsedData.data.name,
      color: parsedData.data.color,
      userId: session.user.id,
    });

    revalidatePath('/', 'layout');
    return { success: true, message: tDiag('toastSuccess') };
  } catch (error) {
    console.error('Error al crear categoría:', error);
    return { success: false, message: t('categories.createError') };
  }
}

export async function updateCategory(categoryId: string, data: InsertCategoryData) {
  const t = await getTranslations('Actions');
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: t('unauthorized') };

  try {
    await db.update(categories)
      .set({ name: data.name, color: data.color })
      .where(eq(categories.id, categoryId));

    revalidatePath('/', 'layout');
    return { success: true, message: t('success') };
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    return { success: false, message: t('categories.updateError') };
  }
}

export async function deleteCategory(categoryId: string) {
  const t = await getTranslations('Actions');
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: t('unauthorized') };

  try {
    await db.delete(categories).where(eq(categories.id, categoryId));
    revalidatePath('/', 'layout');
    return { success: true, message: t('success') };
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    return { success: false, message: t('categories.deleteError') };
  }
}

export async function getUserCategories() {
  const session = await auth();
  if (!session?.user?.id) return [];
  try {
    return await db.select({
      id: categories.id,
      name: categories.name,
      color: categories.color,
      taskCount: sql<number>`count(${tasks.id})`.mapWith(Number),
    })
    .from(categories)
    .leftJoin(tasks, eq(tasks.categoryId, categories.id))
    .where(eq(categories.userId, session.user.id))
    .groupBy(categories.id)
    .orderBy(desc(categories.name));
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return [];
  }
}