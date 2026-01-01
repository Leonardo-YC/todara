import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/prisma';
import { createTodoSchema, todoQuerySchema } from '@/lib/validations/todo.schema';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';
import { sanitizeTodoText } from '@/lib/security/sanitize';
import { ZodError } from 'zod';

// GET: Listar tareas
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rateLimit = await checkRateLimit(session.user.id, 'reads');
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Demasiadas peticiones. Intenta más tarde.' },
        { status: 429, headers: getRateLimitHeaders(rateLimit) }
      );
    }

    const { searchParams } = new URL(req.url);
    const query = todoQuerySchema.parse({
      filter: searchParams.get('filter'),
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset'),
    });

    const where: any = { userId: session.user.id };
    if (query.filter === 'active') where.completed = false;
    if (query.filter === 'completed') where.completed = true;

    const todos = await prisma.todo.findMany({
      where,
      orderBy: [{ completed: 'asc' }, { createdAt: 'desc' }],
      take: query.limit,
      skip: query.offset,
    });

    return NextResponse.json({ todos }, { headers: getRateLimitHeaders(rateLimit) });
  } catch (error) {
    // SOLUCIÓN AQUÍ: Usamos .issues en lugar de .errors
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Error de validación', details: error.issues }, { status: 400 });
    }
    logger.error('Error fetching todos', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST: Crear tarea
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rateLimit = await checkRateLimit(session.user.id, 'mutations');
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Demasiadas peticiones.' },
        { status: 429, headers: getRateLimitHeaders(rateLimit) }
      );
    }

    const body = await req.json();
    const validated = createTodoSchema.parse(body);
    const sanitizedText = sanitizeTodoText(validated.text);

    if (!sanitizedText) {
      return NextResponse.json({ error: 'El texto no es válido' }, { status: 400 });
    }

    const todo = await prisma.todo.create({
      data: {
        text: sanitizedText,
        dueDate: validated.dueDate,
        userId: session.user.id,
      },
    });

    logger.info('Todo created', { id: todo.id });
    return NextResponse.json({ todo }, { status: 201, headers: getRateLimitHeaders(rateLimit) });
  } catch (error) {
    // SOLUCIÓN AQUÍ: Usamos .issues en lugar de .errors
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Error de validación', details: error.issues }, { status: 400 });
    }
    logger.error('Error creating todo', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}