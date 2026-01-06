import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/prisma';
import { updateTodoSchema, todoIdSchema } from '@/lib/validations/todo.schema';
import { ZodError } from 'zod';

type RouteContext = {
  params: { id: string };
};

// PATCH: Actualizar tarea
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const id = todoIdSchema.parse(params.id);

    // ✅ SIN RATE LIMIT NI LOGGER
    const body = await req.json();
    const validated = updateTodoSchema.parse(body);

    const existing = await prisma.todo.findUnique({ where: { id } });
    
    // Validar que la tarea exista y sea del usuario
    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const data: any = {};
    if (validated.completed !== undefined) data.completed = validated.completed;
    if (validated.dueDate !== undefined) data.dueDate = validated.dueDate;
    if (validated.text) data.text = validated.text;

    const todo = await prisma.todo.update({ where: { id }, data });
    
    return NextResponse.json({ todo });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error PATCH todo:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Borrar tarea
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const id = todoIdSchema.parse(params.id);

    // ✅ SIN RATE LIMIT
    const existing = await prisma.todo.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await prisma.todo.delete({ where: { id } });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error DELETE todo:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}