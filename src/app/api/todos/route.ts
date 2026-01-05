import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/prisma';
import { createTodoSchema, todoQuerySchema } from '@/lib/validations/todo.schema';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import { sanitizeTodoText } from '@/lib/security/sanitize';
import { ZodError } from 'zod';
import { startOfDay, endOfDay } from 'date-fns';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const rateLimit = await checkRateLimit(session.user.id, 'reads');
    
    // ✅ CORRECCIÓN: Quitamos { priority: 'desc' } porque Prisma no lo soporta bien sin configuración extra
    // y el ordenamiento alfabético es incorrecto (High > Low > Normal).
    // Ordenaremos visualmente en el cliente.
    const todos = await prisma.todo.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { completed: 'asc' },
        { createdAt: 'desc' }
      ],
    });

    return NextResponse.json({ todos }, { headers: getRateLimitHeaders(rateLimit) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const rateLimit = await checkRateLimit(session.user.id, 'mutations');
    
    const body = await req.json();
    const validated = createTodoSchema.parse(body);
    const sanitizedText = sanitizeTodoText(validated.text);

    if (!sanitizedText) return NextResponse.json({ error: 'Texto inválido' }, { status: 400 });

    const todo = await prisma.todo.create({
      data: {
        text: sanitizedText,
        dueDate: validated.dueDate,
        priority: validated.priority,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ todo }, { status: 201, headers: getRateLimitHeaders(rateLimit) });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error al crear' }, { status: 500 });
  }
}