import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '@/app/globals.css';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // En Next.js 15 los parámetros de ruta son asíncronos
  const { locale } = await params;

  // Si alguien pone un idioma que no existe (ej: /fr/dashboard), lanza 404
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Cargamos el diccionario correcto (es.json o en.json)
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="antialiased text-zinc-950 dark:text-zinc-50">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}