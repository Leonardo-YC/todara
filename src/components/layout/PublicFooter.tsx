'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function PublicFooter({ locale }: { locale: string }) {
  const t = useTranslations('Footer');
  return (
    <footer className="py-12 px-6 border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 transition-colors duration-500">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-black dark:text-white">
          © 2026 TODARA • Boutique Productivity
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
          <Link 
            href={`/${locale}/about`} 
            className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2"
          >
            <Heart className="h-3 w-3 text-red-500" /> {t('about')}
          </Link>
          <Link 
            href={`/${locale}/legal/terms`} 
            className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
          >
            {t('terms')}
          </Link>
          <Link 
            href={`/${locale}/legal/privacy`} 
            className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
          >
            {t('privacy')}
          </Link>
        </div>
      </div>
    </footer>
  );
}