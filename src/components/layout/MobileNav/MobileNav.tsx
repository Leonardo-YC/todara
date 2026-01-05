'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl'; // ✅ Importamos useLocale
import { Inbox, Calendar, CalendarDays, CheckCircle2, AlertCircle } from 'lucide-react';
import styles from './MobileNav.module.css';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'today';
  const t = useTranslations('nav');
  const locale = useLocale(); // ✅ Obtenemos idioma actual

  const navItems = [
    // ✅ URLs dinámicas
    { id: 'today', label: t('today'), icon: Calendar, href: `/${locale}?view=today` },
    { id: 'inbox', label: t('inbox'), icon: Inbox, href: `/${locale}?view=inbox` },
    { id: 'upcoming', label: t('upcomingShort'), icon: CalendarDays, href: `/${locale}?view=upcoming` },
    { id: 'overdue', label: t('overdue'), icon: AlertCircle, href: `/${locale}?view=overdue` },
    { id: 'completed', label: t('done'), icon: CheckCircle2, href: `/${locale}?view=completed` },
  ];

  return (
    <nav className={styles.mobileNav}>
      {navItems.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={cn(styles.link, view === item.id && styles.active)}
        >
          <item.icon size={24} />
          <span className={styles.label}>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}