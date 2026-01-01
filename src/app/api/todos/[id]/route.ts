import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/prisma';
import { updateTodoSchema, todoIdSchema } from '@/lib/validations/todo.schema';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';
import { sanitizeTodoText } from '@/lib/security/sanitize';
import { ZodError } from 'zod';

type RouteContext = {
  params: { id: string };
};

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const id = todoIdSchema.parse(params.id);
    const rateLimit = await checkRateLimit(session.user.id, 'mutations');
    if (!rateLimit.success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    const body = await req.json();
    const validated = updateTodoSchema.parse(body);

    const existing = await prisma.todo.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const data: any = {};
    if (validated.completed !== undefined) data.completed = validated.completed;
    if (validated.dueDate !== undefined) data.dueDate = validated.dueDate;
    if (validated.text) data.text = sanitizeTodoText(validated.text);

    const todo = await prisma.todo.update({ where: { id }, data });
    
    logger.info('Todo updated', { id });
    return NextResponse.json({ todo }, { headers: getRateLimitHeaders(rateLimit) });
  } catch (error) {
    // SOLUCIÓN AQUÍ: .issues
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    logger.error('Error updating todo', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const id = todoIdSchema.parse(params.id);
    const rateLimit = await checkRateLimit(session.user.id, 'mutations');
    if (!rateLimit.success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    const existing = await prisma.todo.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await prisma.todo.delete({ where: { id } });
    
    logger.info('Todo deleted', { id });
    return NextResponse.json({ success: true }, { headers: getRateLimitHeaders(rateLimit) });
  } catch (error) {
    // SOLUCIÓN AQUÍ: .issues
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}