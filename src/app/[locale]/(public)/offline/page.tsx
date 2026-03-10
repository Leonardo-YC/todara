'use client';

import MascotFeedback from '@/components/shared/MascotFeedback';
import { Button } from '@/components/ui/button';
import { WifiOff } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function OfflinePage() {
  const t = useTranslations('Offline');

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8 p-12 bg-zinc-50 dark:bg-zinc-900/50 rounded-[4rem] border border-zinc-100 dark:border-zinc-800">
        <MascotFeedback state="alert" size={160} />
        <div className="absolute -bottom-4 -right-4 h-12 w-12 bg-red-500 rounded-2xl flex items-center justify-center shadow-xl">
          <WifiOff className="h-6 w-6 text-white" />
        </div>
      </div>

      <h1 className="text-4xl font-black tracking-tighter mb-4">{t('title')}</h1>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mb-10 font-medium leading-relaxed">
        {t('description')}
      </p>

      <Link href="/">
        <Button className="h-12 px-10 rounded-2xl font-bold shadow-xl bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200">
          {t('button')}
        </Button>
      </Link>
    </main>
  );
}