import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// 1. Configuramos el middleware de idiomas
const intlMiddleware = createMiddleware(routing);

// 2. Exportamos la ejecución (Más adelante aquí inyectaremos Auth.js)
export default function middleware(req: any) {
  return intlMiddleware(req);
}

// 3. Le decimos a Next.js en qué rutas debe actuar este middleware
export const config = {
  // Ignorar rutas de API, archivos estáticos (_next, public, favicon, etc.)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icons).*)']
};