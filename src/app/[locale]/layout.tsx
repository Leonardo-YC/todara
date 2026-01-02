import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants';
import { TodoProvider } from '@/components/providers';
import { Header } from '@/components/layout/Header/Header';
// 👇 IMPORTANTE: Nuevos componentes PWA
import { OfflineBanner } from '@/components/shared/OfflineBanner';
import { InstallPrompt } from '@/components/shared/InstallPrompt';
import styles from './layout.module.css';
import '../globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const locales = ['en', 'es'];

export const metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
  manifest: '/manifest.json', // 👈 IMPORTANTE: Enlace al manifiesto PWA
};

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${styles.body}`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <TodoProvider>
            
            {/* 👇 AQUÍ LOS AGREGAMOS: Banner Offline y Prompt de Instalación */}
            <OfflineBanner />
            <InstallPrompt />
            
            <Header locale={locale} />
            
            <main id="main-content" className={styles.main}>
              {children}
            </main>

            <footer role="contentinfo" style={{ padding: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              <p>Todara - {locale === 'en' ? 'Accessibility First ❤️' : 'Accesibilidad Primero ❤️'}</p>
            </footer>

          </TodoProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}