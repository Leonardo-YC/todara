import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/shared/theme-provider';
import { PwaRegistry } from '@/components/shared/PwaRegistry'; // 🔥 PWA: 1. Importamos el activador
import type { Metadata, Viewport } from 'next'; // 🔥 PWA: 2. Importamos los tipos
import '@/app/globals.css';

// 🔥 PWA: 3. Metadatos PWA requeridos por los celulares y PC
export const metadata: Metadata = {
  title: 'Todara',
  description: 'Boutique Productivity',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent', // Cambiado para mejor apariencia
    title: 'Todara',
  },
  // Añade estos meta tags importantes
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

// 🔥 PWA: 4. Control de zoom para que se sienta como App nativa
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
            <Toaster position="bottom-right" richColors theme="system" />
            <PwaRegistry /> {/* 🔥 PWA: 5. Encendemos el modo offline */}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}