import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
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
    // 1. Cuando se genera el token, guardamos el nombre si existe
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id!;
        token.name = user.name; // Guardar nombre inicial
      }

      // ✅ FIX CLAVE: Si se dispara una actualización manual (update()), actualizamos el token
      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }
      
      return token;
    },
    // 2. Cuando el cliente pide la sesión, le pasamos lo que hay en el token
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.name = token.name; // ✅ Pasamos el nombre actualizado al cliente
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      if (nextUrl.pathname.startsWith('/api/auth')) return true;
      return true; 
    },
  },
};