'use client';

import { use } from 'react';
import Link from 'next/link';
import { Scale, AlertCircle, Sparkles, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations('Terms');

  return (
    <main className="flex-1 max-w-4xl mx-auto px-6 py-12 md:py-20">
      <header className="mb-16">
        <div className="flex items-center gap-4 md:gap-6 mb-4">
          <div className="shrink-0 h-14 w-14 bg-zinc-900 dark:bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <Scale className="h-7 w-7 text-white dark:text-zinc-900" />
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
            {t('sec1Title')} <Sparkles className="h-6 w-6 text-zinc-400 dark:text-zinc-500" />
          </h2>
          <p>{t('sec1Desc')}</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
            {t('sec2Title')} <AlertCircle className="h-6 w-6 text-zinc-400 dark:text-zinc-500" />
          </h2>
          <p>{t('sec2Desc')}</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
            {t('sec3Title')} <FileText className="h-6 w-6 text-zinc-400 dark:text-zinc-500" />
          </h2>
          <p>{t('sec3Desc')}</p>
        </section>

        <div className="p-8 bg-zinc-50 dark:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs uppercase tracking-widest font-black opacity-50">{t('footerRevision')}</p>
          <Link href={`/${locale}/about`}>
            <Button variant="link" className="text-xs font-bold uppercase">{t('footerButton')}</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}