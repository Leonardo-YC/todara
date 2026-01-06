import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
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

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
  adjustFontFallback: true,
});

const locales = ['en', 'es'];

// ✅ AQUÍ ESTÁ EL CAMBIO CLAVE PARA LOS FAVICONS
export const metadata = {
  title: { template: `%s | ${APP_NAME}`, default: APP_NAME },
  description: APP_DESCRIPTION,
  manifest: '/manifest.json',
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/favicon-light.ico',
        href: '/favicon-light.ico',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/favicon-dark.ico',
        href: '/favicon-dark.ico',
      },
    ],
  },
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
                
                <div className={styles.layoutWrapper}>
                  {session && <Sidebar />}
                  
                  <main id="main-content" className={styles.main}>
                    {children}
                  </main>
                </div>
                
                {session && <MobileNav />}
                
                <div className={session ? styles.footerContainer : ''}>
                  <SiteFooter /> 
                </div>
                
              </TodoProvider>
            </ThemeProvider>
          </AuthProvider>
        </NextIntlClientProvider>

        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}