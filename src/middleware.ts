import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { NextResponse } from 'next/server';

// Inicializamos NextAuth solo con la config ligera para el Edge
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;

  // Rutas públicas
  const publicRoutes = ['/', '/auth/signin', '/auth/verify', '/auth/error'];
  const publicApiRoutes = ['/api/auth', '/api/health'];

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  const isPublicApiRoute = publicApiRoutes.some((route) => pathname.startsWith(route));

  // Si es ruta pública, permitimos el paso
  if (isPublicRoute || isPublicApiRoute) {
    return NextResponse.next();
  }

  // Protección de rutas API
  if (pathname.startsWith('/api/') && !isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Protección de rutas privadas (si no es pública y no está autenticado)
  // Nota: NextAuth suele redirigir, pero esto fuerza la seguridad
  /* if (!isAuthenticated && !isPublicRoute) {
     return NextResponse.redirect(new URL('/auth/signin', req.url));
  }
  */

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};