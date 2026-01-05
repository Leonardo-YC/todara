'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl'; // ✅ Importamos useLocale
import { Inbox, Calendar, CalendarDays, CheckCircle2, AlertCircle } from 'lucide-react';
import styles from './Sidebar.module.css';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'today';
  const t = useTranslations('nav');
  const locale = useLocale(); // ✅ Obtenemos idioma actual

  const navItems = [
    // ✅ Construimos la URL con el idioma: /es?view=today
    { id: 'today', label: t('today'), icon: Calendar, href: `/${locale}?view=today` },
    { id: 'inbox', label: t('inbox'), icon: Inbox, href: `/${locale}?view=inbox` },
    { id: 'upcoming', label: t('upcoming'), icon: CalendarDays, href: `/${locale}?view=upcoming` },
    { id: 'overdue', label: t('overdue'), icon: AlertCircle, href: `/${locale}?view=overdue` },
    { id: 'completed', label: t('completed'), icon: CheckCircle2, href: `/${locale}?view=completed` },
  ];

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={cn(styles.link, view === item.id && styles.active)}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}