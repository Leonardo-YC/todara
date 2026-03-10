'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MascotFeedback from '@/components/shared/MascotFeedback';
import { useLocale, useTranslations } from 'next-intl';

export default function NotFound() {
  const locale = useLocale();
  const t = useTranslations('NotFound');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-zinc-950 p-6 text-center transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative mb-10"
      >
        <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-900 rounded-full blur-3xl opacity-50 scale-150" />
        <div className="relative p-12 bg-zinc-50 dark:bg-zinc-900/50 rounded-[4rem] border border-zinc-100 dark:border-zinc-800 shadow-inner">
          <MascotFeedback state="alert" size={180} />
          <div className="absolute -top-4 -right-4 h-12 w-12 bg-zinc-950 dark:bg-white rounded-2xl flex items-center justify-center shadow-xl rotate-12">
            <Search className="h-6 w-6 text-white dark:text-zinc-950" />
          </div>
        </div>
      </motion.div>

      <div className="space-y-4 max-w-md mb-10">
        <h1 className="text-5xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 leading-none">
          {t('title')} <span className="text-zinc-400">Error.</span>
        </h1>
        <h2 className="text-xl font-bold tracking-tight">{t('subtitle')}</h2>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium">
          {t('desc')}
        </p>
      </div>

      <Link href={`/${locale}/dashboard/tasks`}>
        <Button className="h-12 px-8 rounded-2xl font-bold gap-2 shadow-xl transition-all hover:scale-105 active:scale-95">
          <Home className="h-4 w-4" />
          {t('buttonTasks')}
        </Button>
      </Link>
    </div>
  );
}