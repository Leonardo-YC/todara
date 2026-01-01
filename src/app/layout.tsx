import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Cambiamos Geist por Inter
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants';
import styles from './layout.module.css';
import './globals.css';

// Usamos Inter en lugar de Geist
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
      {/* Aplicamos la variable de fuente Inter y los estilos del module */}
      <body className={`${inter.variable} ${styles.body}`}>
        <main className={styles.main}>
          {children}
        </main>
      </body>
    </html>
  );
}