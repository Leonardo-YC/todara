import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server'; // 🔥 SEO: Añadimos getTranslations
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/shared/theme-provider';
import { PwaRegistry } from '@/components/shared/PwaRegistry'; 
import { CookieBanner } from '@/components/shared/CookieBanner'; 
import type { Metadata, Viewport } from 'next'; 
import '@/app/globals.css';

// 🔥 SEO: Generación dinámica de Metadatos según el idioma
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    // 🔥 FIX: Base URL para que las imágenes de redes sociales (OpenGraph) se generen bien y quite el warning
    metadataBase: new URL('https://todara.vercel.app'),
    
    title: t('title'),
    description: t('description'),
    manifest: '/manifest.json',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: 'Todara',
    },
    other: {
      'mobile-web-app-capable': 'yes',
    },
    // 🔥 OG Tags para que se vea hermoso al compartir el link en WhatsApp/Twitter
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: 'https://todara.vercel.app', // Cambia esto por tu dominio real si tienes otro
      siteName: 'Todara',
      images: [
        {
          url: '/logos/logo-todara-512.png',
          width: 512,
          height: 512,
        },
      ],
      locale: locale,
      type: 'website',
    },
  };
}

// 🔥 PWA: Control de zoom para que se sienta como App nativa
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="antialiased text-zinc-950 dark:text-zinc-50 min-h-screen bg-white dark:bg-zinc-950">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            {children}
            {/* 🔥 COOKIES: Renderizamos el banner aquí, flotará por encima de todo */}
            <CookieBanner /> 
            <Toaster position="bottom-right" richColors theme="system" />
            <PwaRegistry /> {/* 🔥 PWA: Encendemos el modo offline */}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}