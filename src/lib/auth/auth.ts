import NextAuth from 'next-auth';
import Nodemailer from 'next-auth/providers/nodemailer';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '../db'; 
import { accounts, sessions, users, verificationTokens } from '../db/schema';
import authConfig from './auth.config';
import { createTransport } from 'nodemailer';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  // 🔥 CONFIGURACIÓN DE SESIÓN BOUTIQUE
  session: { 
    strategy: 'jwt',
    maxAge: 90 * 24 * 60 * 60, // 90 días (aprox 3 meses)
    updateAge: 24 * 60 * 60,   // Se actualiza la sesión cada 24h de actividad
  },
  ...authConfig,
  
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      } else if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Si la URL ya es el dashboard, lo permitimos
      if (url.includes('/dashboard')) {
        return url.startsWith(baseUrl) ? url : `${baseUrl}${url}`;
      }
      // Por defecto, tras login, siempre al dashboard
      return `${baseUrl}/es/dashboard/tasks`;
    },
  },

  providers: [
    ...authConfig.providers,
    Nodemailer({
      server: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, 
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({ identifier: email, url, provider }) {
        const transport = createTransport(provider.server);
        await transport.sendMail({
          to: email,
          from: provider.from,
          subject: `Accede a Todara`,
          text: `Entra a Todara: ${url}`,
          html: `
            <div style="background-color: #f4f4f5; padding: 60px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; text-align: center;">
              <div style="background-color: #ffffff; max-width: 460px; margin: 0 auto; padding: 48px; border-radius: 48px; border: 1px solid #e4e4e7; box-shadow: 0 20px 40px rgba(0,0,0,0.03);">
                <div style="margin-bottom: 32px;">
                  <h1 style="font-size: 32px; font-weight: 900; color: #09090b; letter-spacing: -2px; margin: 0;">Todara</h1>
                </div>
                <h2 style="font-size: 24px; font-weight: 800; color: #09090b; margin-bottom: 12px; letter-spacing: -0.5px;">Tu refugio te espera</h2>
                <p style="color: #71717a; font-size: 16px; line-height: 24px; margin-bottom: 32px; font-weight: 500;">
                  Haz clic en el botón inferior para sincronizar tu productividad boutique.
                </p>
                <a href="${url}" style="background-color: #09090b; color: #ffffff; padding: 20px 48px; border-radius: 24px; text-decoration: none; font-weight: 700; display: inline-block; font-size: 16px; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">
                  Entrar a mi Dashboard
                </a>
                <div style="margin-top: 48px; padding-top: 32px; border-top: 1px solid #f4f4f5;">
                  <p style="font-size: 11px; color: #a1a1aa; line-height: 1.6; margin: 0; text-transform: uppercase; letter-spacing: 1px;">
                    Seguridad Boutique • Este enlace es de un solo uso y caduca en 24h.
                  </p>
                </div>
              </div>
              <p style="margin-top: 32px; font-size: 11px; color: #a1a1aa; font-weight: 700;">
                © 2026 TODARA • BOUTIQUE PRODUCTIVITY
              </p>
            </div>
          `,
        });
      },
    }),
  ],
});