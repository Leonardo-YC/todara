import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import NextAuth from 'next-auth';
import authConfig from '@/lib/auth/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);
const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
  const pathname = req.nextUrl.pathname;
  const locale = pathname.split('/')[1] || 'es';
  
  // 1. Permitir archivos estáticos y activos
  if (
    pathname.startsWith('/logos') ||
    pathname.startsWith('/icons') ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|json|js)$/)
  ) {
    return NextResponse.next();
  }

  const isLoggedIn = !!req.auth;

  // 🔥 MEJORA PROFESIONAL: Auto-Redirección desde Landing O Auth hacia Dashboard
  const isLandingPage = pathname === '/' || pathname === `/${locale}` || pathname === `/${locale}/`;
  const isAuthPage = pathname.includes('/signin') || pathname.includes('/verify'); // Detectamos páginas de login
  
  if ((isLandingPage || isAuthPage) && isLoggedIn) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard/tasks`, req.url));
  }

  // 2. Lógica de protección: Solo usuarios logueados entran al Dashboard
  const isPrivatePage = pathname.includes('/dashboard');

  if (isPrivatePage && !isLoggedIn) {
    return NextResponse.redirect(new URL(`/${locale}/signin`, req.url));
  }

  // 3. Aplicar middleware de internacionalización
  return intlMiddleware(req);
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)', '/', '/(es|en)/:path*']
};