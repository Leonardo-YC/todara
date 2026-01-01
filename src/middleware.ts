import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;

  // Rutas que cualquiera puede ver (Públicas)
  const publicRoutes = ['/', '/auth/signin', '/auth/verify', '/auth/error'];
  // Rutas de API públicas
  const publicApiRoutes = ['/api/auth', '/api/health'];

  // Si es ruta pública, dejar pasar
  if (publicRoutes.some((route) => pathname.startsWith(route)) || 
      publicApiRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Si intenta entrar a la API de todos sin estar logueado -> Error 401
  if (pathname.startsWith('/api/') && !isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Si intenta entrar a cualquier otra página protegida sin login -> Redirigir a login
  // (Opcional: NextAuth suele manejar esto, pero el middleware da doble seguridad)
  
  return NextResponse.next();
});

// Configuración: A qué rutas aplica el middleware
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};