import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/prisma';
import { createTodoSchema } from '@/lib/validations/todo.schema';
import { ZodError } from 'zod';

// GET: Obtener tareas
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // ✅ SIN RATE LIMIT
    const todos = await prisma.todo.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { completed: 'asc' },
        { createdAt: 'desc' }
      ],
    });

    return NextResponse.json({ todos });
  } catch (error) {
    console.error('Error GET todos:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// POST: Crear tarea
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // ✅ SIN RATE LIMIT
    const body = await req.json();
    const validated = createTodoSchema.parse(body);

    const todo = await prisma.todo.create({
      data: {
        text: validated.text, // Usamos el texto directo (Next.js protege lo básico)
        dueDate: validated.dueDate,
        priority: validated.priority,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ todo }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', details: error.issues }, { status: 400 });
    }
    console.error('Error POST todo:', error);
    return NextResponse.json({ error: 'Error al crear' }, { status: 500 });
  }
}