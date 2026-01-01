import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants';
import { TodoProvider } from '@/components/providers';
import { Header } from '@/components/layout/Header/Header'; // <-- Nuevo Import
import styles from './layout.module.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${styles.body}`}>
        <TodoProvider>
          {/* El Header ya incluye el SkipLink internamente */}
          <Header locale="es" />
          
          {/* IMPORTANTE: id="main-content" para que el SkipLink funcione */}
          <main id="main-content" className={styles.main}>
            {children}
          </main>
          
          <footer role="contentinfo" style={{ padding: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            <p>Todara - Accesibilidad Primero ❤️</p>
          </footer>
        </TodoProvider>
      </body>
    </html>
  );
}