import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/prisma';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const rateLimit = await checkRateLimit(session.user.id, 'mutations');
    if (!rateLimit.success) return NextResponse.json({ error: 'Rate limit' }, { status: 429 });

    const { count } = await prisma.todo.deleteMany({
      where: { userId: session.user.id, completed: true },
    });

    logger.info('Cleared completed', { count });
    return NextResponse.json({ deleted: count });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}