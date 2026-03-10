'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/shared/ModeToggle';
import { LocaleSwitcher } from '@/components/shared/LocaleSwitcher';
import { useTranslations } from 'next-intl';

export function PublicNavbar({ locale }: { locale: string }) {
  const t = useTranslations('Navbar');

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900">
      
      {/* LOGO OFICIAL SVG - Tamaño Boutique */}
      <Link href={`/${locale}`} className="flex items-center gap-3 group transition-opacity hover:opacity-80">
        <div className="relative h-10 w-10 transition-transform group-hover:scale-105">
          <Image 
            src="/logos/todara-logo.svg" 
            alt="Todara Logo" 
            fill 
            className="object-contain" 
          />
        </div>
        <span className="text-xl font-bold tracking-tighter hidden sm:block text-zinc-900 dark:text-white">
            Todara
        </span>
      </Link>
      
      <div className="flex items-center gap-4">
        {/* GRUPO DE HERRAMIENTAS - Ahora ambos miden lo mismo de alto */}
        <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <ModeToggle />
        </div>

        <div className="h-6 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />

        <Link href={`/${locale}/signin`}>
          <Button variant="ghost" className="rounded-full font-bold hidden sm:flex text-zinc-900 dark:text-zinc-100">
            {t('signin')}
          </Button>
          <Button size="sm" className="rounded-full font-bold sm:hidden bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
            {t('enter')}
          </Button>
        </Link>
      </div>
    </nav>
  );
}