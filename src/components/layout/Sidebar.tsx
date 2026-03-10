'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { CheckCircle2, FolderIcon, CalendarDays, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import MascotFeedback from '@/components/shared/MascotFeedback';
import { useTranslations } from 'next-intl';

export function Sidebar({ 
  locale, 
  isMobile = false,
  mascotState = 'neutral' 
}: { 
  locale: string; 
  isMobile?: boolean;
  mascotState?: 'neutral' | 'happy' | 'alert'
}) {
  const pathname = usePathname();
  const t = useTranslations('Sidebar');
  const tCommon = useTranslations('Common');

  const navItems = [
    { name: t('tasks'), href: `/${locale}/dashboard/tasks`, icon: CheckCircle2 },
    { name: t('folders'), href: `/${locale}/dashboard/categories`, icon: FolderIcon },
    { name: t('calendar'), href: `/${locale}/dashboard/calendar`, icon: CalendarDays },
    { name: t('settings'), href: `/${locale}/dashboard/settings`, icon: Settings },
  ];

  return (
    <aside className={cn(
      "flex flex-col bg-white dark:bg-zinc-950 transition-colors duration-300",
      isMobile 
        ? "h-full w-full" 
        : "hidden lg:flex border-r border-zinc-200 dark:border-zinc-800 w-[260px] h-screen sticky top-0 shrink-0"
    )}>
      {/* Cabecera del Sidebar: Logo y Nombre */}
      <div className="flex h-16 items-center border-b px-6 border-zinc-200 dark:border-zinc-800 shrink-0">
        <Link href={`/${locale}`} className="flex items-center gap-3 font-semibold group">
          <div className="relative h-8 w-8 transition-transform group-hover:scale-110">
            <Image src="/logos/todara-logo.svg" alt="Todara" fill className="object-contain" />
          </div>
          <span className="text-lg tracking-tight font-bold text-zinc-950 dark:text-white">Todara</span>
        </Link>
      </div>

      {/* Navegación Principal */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-200",
                  isActive 
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-lg" 
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-50 dark:hover:bg-zinc-900/50"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "animate-pulse" : "")} />
                <span className="font-semibold text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sofi: Feedback al final */}
      <div className="p-4 mt-auto border-t border-zinc-100 dark:border-zinc-900 shrink-0">
        <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800 flex flex-col items-center gap-3">
          <MascotFeedback state={mascotState} size={75} />
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-400 dark:text-zinc-600 text-center">
              {tCommon('mascotName')}
            </p>
            <div className="h-1 w-6 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto" />
          </div>
        </div>
      </div>
    </aside>
  );
}