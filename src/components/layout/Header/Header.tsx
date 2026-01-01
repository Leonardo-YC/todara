import Link from 'next/link';
import { SkipLink } from '../SkipLink'; // Importación limpia gracias al index.ts
import { LanguageToggle } from '../LanguageToggle'; // Importación limpia corregida
import styles from './Header.module.css';

interface HeaderProps {
  locale?: string;
}

export function Header({ locale = 'es' }: HeaderProps) {
  return (
    <>
      <SkipLink />
      
      <header role="banner" className={styles.header}>
        <div className={styles.container}>
          {/* Logo/Marca */}
          <Link href="/" aria-label="Ir al inicio de Todara" className={styles.brand}>
            <div className={styles.logoBox} aria-hidden="true">✓</div>
            <span className={styles.brandName}>Todara</span>
          </Link>

          {/* Título oculto para lectores de pantalla */}
          <h1 className="sr-only">Todara - La App de Tareas Perfecta</h1>

          {/* Navegación */}
          <nav aria-label="Navegación principal" className={styles.nav}>
            <LanguageToggle currentLocale={locale as 'en' | 'es'} />
          </nav>
        </div>
      </header>
    </>
  );
}