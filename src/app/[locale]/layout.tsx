import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants';
import { TodoProvider } from '@/components/providers';
import { Header } from '@/components/layout/Header/Header';
import styles from './layout.module.css';
import '../globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// Definimos los idiomas que soportamos
const locales = ['en', 'es'];

export const metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
};

// Notar que ahora es una función ASYNC para cargar mensajes
export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // 1. Validación de seguridad: Si el idioma no es válido, error 404
  if (!locales.includes(locale)) {
    notFound();
  }

  // 2. Cargamos las traducciones del servidor
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${styles.body}`}>
        {/* PROVIDER ESENCIAL: Sin esto, useTranslations falla */}
        <NextIntlClientProvider messages={messages} locale={locale}>
          
          <TodoProvider>
            {/* Pasamos el locale dinámico al Header */}
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