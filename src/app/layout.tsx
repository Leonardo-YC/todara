import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants';
import { TodoProvider } from '@/components/providers'; // Importamos el Provider
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
        {/* Envolvemos la app con el Provider de Estado Global */}
        <TodoProvider>
          <main className={styles.main}>
            {children}
          </main>
        </TodoProvider>
      </body>
    </html>
  );
}