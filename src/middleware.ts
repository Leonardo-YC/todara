import createMiddleware from 'next-intl/middleware';
import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { NextResponse } from 'next/server';

// 1. Configuración de i18n (Idiomas)
const intlMiddleware = createMiddleware({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
});

// 2. Inicializamos NextAuth
const { auth } = NextAuth(authConfig);

// 3. Exportamos el middleware combinado
export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;

  // --- LÓGICA DE SEGURIDAD (Tu código anterior) ---

  // Lista de rutas API públicas (no requieren auth)
  const publicApiRoutes = ['/api/auth', '/api/health'];
  const isPublicApiRoute = publicApiRoutes.some((route) => 
    nextUrl.pathname.startsWith(route)
  );

  // Protección de rutas API:
  // Si es una ruta /api/, no es pública y no está autenticado -> Error 401
  if (nextUrl.pathname.startsWith('/api/') && !isPublicApiRoute && !isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Si es una ruta API pública o autenticada, dejamos pasar la API sin tocar i18n
  if (nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // --- LÓGICA DE I18N (Nuevo) ---
  
  // Si no es API, es una página (Frontend). 
  // Dejamos que next-intl maneje la redirección (/es, /en) y los headers.
  return intlMiddleware(req);
});

// 4. Configuración del Matcher (Para que aplique a todo menos archivos estáticos)
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};