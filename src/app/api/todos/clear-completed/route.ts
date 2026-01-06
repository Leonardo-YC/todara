import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/prisma';

// POST: Borrar completadas
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // ✅ SIN RATE LIMIT NI LOGGER
    const { count } = await prisma.todo.deleteMany({
      where: { userId: session.user.id, completed: true },
    });

    return NextResponse.json({ deleted: count });
  } catch (error) {
    console.error('Error clear-completed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}