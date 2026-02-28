import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import NextAuth from 'next-auth';
import authConfig from '@/lib/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);
const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
  // 🔥 NUEVO: Permitir acceso directo a archivos estáticos
  const pathname = req.nextUrl.pathname;
  
  // Si la ruta es un archivo estático (logos, icons, etc.), déjalo pasar
  if (
    pathname.startsWith('/logos') ||
    pathname.startsWith('/icons') ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|json)$/)
  ) {
    return NextResponse.next();
  }

  // Lógica de autenticación
  const isPrivatePage = pathname.includes('/dashboard');
  const isLoggedIn = !!req.auth;

  if (isPrivatePage && !isLoggedIn) {
    const locale = pathname.split('/')[1] || 'es';
    return NextResponse.redirect(new URL(`/${locale}/signin`, req.url));
  }

  // Aplicar middleware de internacionalización
  return intlMiddleware(req);
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|manifest.json).*)']
};