import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Toaster } from '@/components/ui/sonner'; // 🔥 Aseguramos Sonner
import '@/app/globals.css';

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
      <body className="antialiased text-zinc-950 dark:text-zinc-50 min-h-screen">
        <NextIntlClientProvider messages={messages}>
          {children}
          {/* 🔥 Notificaciones premium configuradas globalmente */}
          <Toaster position="bottom-right" richColors theme="system" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}