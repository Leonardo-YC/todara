import NextAuth from 'next-auth';
import Nodemailer from 'next-auth/providers/nodemailer';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from './db';
import { accounts, sessions, users, verificationTokens } from './db/schema';
import authConfig from './auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Conectamos a Drizzle
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: 'jwt' },
  // Traemos Google, GitHub y las páginas del archivo ligero
  ...authConfig,
  
  // 🔥 AQUÍ ESTÁ LA SOLUCIÓN: Le decimos a Auth.js que exponga el ID
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        // Auth.js guarda nativamente el ID del usuario en token.sub
        session.user.id = token.sub;
      } else if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  // Añadimos el proveedor pesado (Nodemailer) solo en el servidor
  providers: [
    ...authConfig.providers,
    Nodemailer({
      server: {
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
});