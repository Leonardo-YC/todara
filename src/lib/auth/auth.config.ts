import type { NextAuthConfig } from 'next-auth';

// Esta configuración es segura para el Edge (Middleware)
export const authConfig: NextAuthConfig = {
  // Dejamos providers vacío aquí para evitar errores de Node.js en el Edge
  providers: [], 
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },

  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify',
    error: '/auth/error',
  },

  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id!;
      }
      return token;
    },
    authorized({ auth, request: { nextUrl } }) {
      // Lógica de protección de rutas (Middleware)
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard'); // Ejemplo
      
      // Permitir acceso a la API de Auth siempre
      if (nextUrl.pathname.startsWith('/api/auth')) return true;

      // Aquí puedes agregar más lógica si la necesitas
      return true; 
    },
  },
};