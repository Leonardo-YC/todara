import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/prisma';

// PATCH: Actualizar nombre
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    // Validar sesión
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Validar nombre
    if (!body.name || body.name.trim().length < 2) {
        return NextResponse.json({ error: 'Nombre muy corto' }, { status: 400 });
    }

    // Actualizar en DB
    const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: { name: body.name },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// DELETE: Eliminar cuenta
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await prisma.user.delete({
        where: { id: session.user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}