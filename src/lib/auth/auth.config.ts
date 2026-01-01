/**
 * NextAuth.js configuration
 * Using email magic links for authentication
 */

import type { NextAuthConfig } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/db/prisma';

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      maxAge: 24 * 60 * 60, // 24 hours
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
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
        // El signo de exclamación (!) le dice a TS que confiamos en que el ID existe
        token.sub = user.id!; 
      }
      return token;
    },
  },

  // Eventos para logging simple en desarrollo
  events: {
    async signIn({ user, isNewUser }) {
      if (process.env.NODE_ENV === 'development') {
        console.log('User signed in:', user.email, 'New user:', isNewUser);
      }
    },
  },

  debug: process.env.NODE_ENV === 'development',
};