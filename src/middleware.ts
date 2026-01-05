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

  // ✅ EXCLUIR ARCHIVOS ESTÁTICOS
  const staticPaths = [
    '/icons/', '/images/', '/fonts/', '/sw.js', '/workbox-', 
    '/manifest.json', '/robots.txt', '/sitemap.xml',
  ];

  const isStaticFile = staticPaths.some(path => nextUrl.pathname.startsWith(path)) ||
                       nextUrl.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot)$/);

  if (isStaticFile) return NextResponse.next();

  // --- LÓGICA DE AUTH API ---
  const publicApiRoutes = ['/api/auth', '/api/health'];
  const isPublicApiRoute = publicApiRoutes.some((route) => nextUrl.pathname.startsWith(route));

  // Protección de rutas API
  if (nextUrl.pathname.startsWith('/api/') && !isPublicApiRoute && !isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Si es ruta API, pasamos sin i18n
  if (nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    addSecurityHeaders(response); // Agregamos seguridad también a la API
    return response;
  }

  // --- LÓGICA DE I18N + SEGURIDAD ---
  // Generamos la respuesta de i18n primero
  const response = intlMiddleware(req);

  // 🛡️ INYECCIÓN DE CABECERAS DE SEGURIDAD (FASE 12)
  addSecurityHeaders(response);

  return response;
});

// Función auxiliar para no repetir código
function addSecurityHeaders(response: NextResponse) {
  response.headers.set('X-Frame-Options', 'SAMEORIGIN'); // Anti-Clickjacking
  response.headers.set('X-Content-Type-Options', 'nosniff'); // Anti-MIME sniffing
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains'); // HTTPS forzado
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin'); // Privacidad
}

// 4. Configuración del Matcher
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons/|images/|.*\\..*).*)',
  ],
};