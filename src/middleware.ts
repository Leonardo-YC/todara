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

  // ✅ EXCLUIR ARCHIVOS ESTÁTICOS DE I18N (NUEVA LÓGICA)
  const staticPaths = [
    '/icons/',
    '/images/',
    '/fonts/',
    '/sw.js',
    '/workbox-',
    '/manifest.json',
    '/robots.txt',
    '/sitemap.xml',
  ];

  const isStaticFile = staticPaths.some(path => nextUrl.pathname.startsWith(path)) ||
                       nextUrl.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot)$/);

  // Si es un archivo estático, déjalo pasar sin i18n ni auth
  if (isStaticFile) {
    return NextResponse.next();
  }

  // --- LÓGICA DE SEGURIDAD (Tu código anterior) ---
  const publicApiRoutes = ['/api/auth', '/api/health'];
  const isPublicApiRoute = publicApiRoutes.some((route) => 
    nextUrl.pathname.startsWith(route)
  );

  // Protección de rutas API
  if (nextUrl.pathname.startsWith('/api/') && !isPublicApiRoute && !isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Si es una ruta API, dejamos pasar sin i18n
  if (nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // --- LÓGICA DE I18N ---
  return intlMiddleware(req);
});

// 4. Configuración del Matcher (Optimizado)
export const config = {
  // ✅ Excluye archivos estáticos del middleware completamente
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons/|images/|.*\\..*).*)',
  ],
};