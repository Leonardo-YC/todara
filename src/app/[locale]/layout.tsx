import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants';
import { TodoProvider, AuthProvider, ThemeProvider } from '@/components/providers'; 
import { Header } from '@/components/layout/Header/Header';
import { Sidebar } from '@/components/layout/Sidebar/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav/MobileNav';
import { SiteFooter } from '@/components/layout/SiteFooter/SiteFooter'; 
import { OfflineBanner } from '@/components/shared/OfflineBanner';
import { InstallPrompt } from '@/components/shared/InstallPrompt';
import { auth } from '@/lib/auth/auth'; 
import styles from './layout.module.css';
import '../globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const locales = ['en', 'es'];

export const metadata = {
  title: { template: `%s | ${APP_NAME}`, default: APP_NAME },
  description: APP_DESCRIPTION,
  manifest: '/manifest.json',
};

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale)) notFound();
  const messages = await getMessages();

  // 1. Obtenemos la sesión
  const session = await auth();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} ${styles.body}`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <TodoProvider>
                
                <OfflineBanner />
                <InstallPrompt />
                
                <Header locale={locale} />
                
                {/* 2. Sidebar solo con sesión */}
                <div className={styles.layoutWrapper}>
                  {session && <Sidebar />}
                  
                  <main id="main-content" className={styles.main}>
                    {children}
                  </main>
                </div>
                
                {/* 3. MobileNav solo con sesión */}
                {session && <MobileNav />}
                
                {/* ✅ 4. FOOTER CON ESPACIO EXTRA EN MÓVIL
                    Si hay sesión, aplicamos la clase que añade padding-bottom.
                    Si no hay sesión (login), se ve normal. */}
                <div className={session ? styles.footerContainer : ''}>
                  <SiteFooter /> 
                </div>
                
              </TodoProvider>
            </ThemeProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}