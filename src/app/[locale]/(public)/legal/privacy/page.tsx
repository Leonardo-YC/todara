'use client';

import { ShieldCheck, Lock, Eye, Database } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function PrivacyPage() {
  const t = useTranslations('Privacy');

  return (
    <main className="flex-1 max-w-4xl mx-auto px-6 py-12 md:py-20">
      <header className="mb-16">
        <div className="flex items-center gap-4 md:gap-6 mb-4">
          <div className="shrink-0 h-14 w-14 bg-zinc-900 dark:bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <ShieldCheck className="h-7 w-7 text-white dark:text-zinc-900" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic leading-none">
            {t('titleMain')} <span className="text-zinc-400">{t('titleStyle')}</span>
          </h1>
        </div>
        <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium">
          {t('subtitle')}
        </p>
      </header>

      <div className="space-y-12 text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
            {t('sec1Title')} <Eye className="h-6 w-6 text-zinc-400 dark:text-zinc-500" />
          </h2>
          <p>{t('sec1Desc')}</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
            {t('sec2Title')} <Database className="h-6 w-6 text-zinc-400 dark:text-zinc-500" />
          </h2>
          <p>{t('sec2Desc')}</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
            {t('sec3Title')} <Lock className="h-6 w-6 text-zinc-400 dark:text-zinc-500" />
          </h2>
          <p>{t('sec3Desc')}</p>
        </section>

        <section className="p-8 bg-zinc-50 dark:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800">
          <h3 className="text-zinc-900 dark:text-zinc-100 font-bold mb-2">{t('cookiesTitle')}</h3>
          <p className="text-sm">{t('cookiesDesc')}</p>
        </section>
      </div>
    </main>
  );
}