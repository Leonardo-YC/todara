import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import MicrosoftEntraId from 'next-auth/providers/microsoft-entra-id';
import { createTransport } from 'nodemailer'; // ✅ Importante para el diseño custom
import { prisma } from '@/lib/db/prisma';
import { authConfig } from './auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    MicrosoftEntraId({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    
    // ✅ CONFIGURACIÓN "BOUTIQUE" DEL CORREO
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
      maxAge: 24 * 60 * 60, // 24 horas de validez
      
      // 👇 FUNCIÓN QUE INYECTA TU DISEÑO
      async sendVerificationRequest(params) {
        const { identifier, url, provider } = params;
        const { host } = new URL(url);
        
        const transport = createTransport(provider.server);
        
        const result = await transport.sendMail({
          to: identifier,
          from: provider.from, // Tomará el nombre "Todara" del .env
          subject: `Inicia sesión en Todara 🐶`,
          text: text({ url, host }),
          html: html({ url, host }),
        });
        
        const failed = result.rejected.concat(result.pending).filter(Boolean);
        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
        }
      },
    }),
  ],
});

// --- 🎨 PLANTILLA DE DISEÑO ---

function html(params: { url: string; host: string }) {
  const { url } = params;

  // Colores de Todara
  const brandColor = "#2563eb"; 
  const bgColor = "#f9fafb";
  
  // ✅ USAMOS TU LOGO DE VERCEL (Gmail necesita URL pública, no local)
  const logoUrl = "https://todara.vercel.app/icons/icon-512x512.svg"; 

  return `
<body style="background: ${bgColor}; margin: 0; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0"
    style="background: #ffffff; max-width: 500px; margin: auto; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    
    <tr>
      <td align="center" style="padding: 30px 20px; background-color: #0f172a;">
        <img src="${logoUrl}" width="80" height="80" alt="Todara" style="display: block; border-radius: 12px;" />
      </td>
    </tr>

    <tr>
      <td align="center" style="padding: 30px 30px 10px 30px;">
        <h2 style="color: #0f172a; margin: 0 0 10px 0; font-size: 24px;">¡Hola!</h2>
        <p style="color: #64748b; font-size: 16px; line-height: 1.5; margin: 0;">
          Has solicitado iniciar sesión en <strong>Todara</strong>.
          Haz clic abajo para entrar.
        </p>
      </td>
    </tr>

    <tr>
      <td align="center" style="padding: 20px 0;">
        <a href="${url}"
          target="_blank"
          style="background-color: ${brandColor}; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; padding: 12px 32px; border-radius: 50px; display: inline-block; box-shadow: 0 4px 14px 0 rgba(37, 99, 235, 0.39);">
          Ingresar a Todara
        </a>
      </td>
    </tr>

    <tr>
      <td align="center" style="padding: 20px 30px 30px 30px; border-top: 1px solid #f1f5f9;">
        <p style="font-size: 13px; color: #94a3b8; margin: 0;">
          Si no fuiste tú, ignora este mensaje.<br>
          Hecho con excelencia por <strong>LYC Labs</strong>.
        </p>
      </td>
    </tr>
  </table>
</body>
`;
}

function text({ url, host }: { url: string; host: string }) {
  return `Inicia sesión en Todara\n${url}\n\n`;
}