'use client';

import { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Target, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MascotFeedback from '@/components/shared/MascotFeedback';
import { useTranslations } from 'next-intl';

export default function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations('About');

  return (
    <main className="flex-1 max-w-5xl mx-auto px-6 py-12 md:py-20">
      <section className="text-center space-y-10 mb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block relative"
        >
          <div className="absolute -inset-4 bg-zinc-100 dark:bg-zinc-900 rounded-[4rem] blur-2xl opacity-50" />
          <div className="relative p-10 bg-zinc-50 dark:bg-zinc-900/50 rounded-[3.5rem] border border-zinc-100 dark:border-zinc-800 shadow-inner">
            <MascotFeedback state="happy" size={150} />
          </div>
        </motion.div>
        
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <Sparkles className="h-3 w-3 text-yellow-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{t('badge')}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 leading-none">
            {t('titleMain')} <br />
            <span className="text-zinc-400 font-medium italic">{t('titleStyle')}</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed">
            {t('description')}
          </p>
        </div>
      </section>

      <div className="grid gap-8 md:grid-cols-2 mb-28">
        <div className="p-8 md:p-12 bg-zinc-50 dark:bg-zinc-900/30 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 space-y-6">
          <div className="h-14 w-14 rounded-2xl bg-zinc-950 dark:bg-white flex items-center justify-center shadow-lg shadow-zinc-500/10">
            <Heart className="h-7 w-7 text-white dark:text-zinc-950" />
          </div>
          <h3 className="text-3xl font-black tracking-tight">{t('sofiTitle')}</h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed">
            {t('sofiDesc')}
          </p>
        </div>

        <div className="p-8 md:p-12 bg-white dark:bg-zinc-950 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 space-y-6 shadow-sm">
          <div className="h-14 w-14 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
            <Target className="h-7 w-7 text-zinc-900 dark:text-white" />
          </div>
          <h3 className="text-3xl font-black tracking-tight">{t('missionTitle')}</h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed">
            {t('missionDesc')}
          </p>
        </div>
      </div>

      <section className="bg-zinc-950 dark:bg-zinc-100 p-10 md:p-20 rounded-[3.5rem] md:rounded-[5rem] text-center space-y-8 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 bg-white/10 rounded-full blur-3xl" />
        <h2 className="text-3xl md:text-5xl font-black text-white dark:text-zinc-950 tracking-tighter leading-tight relative z-10">
          {t('ctaTitle')}
        </h2>
        <div className="flex justify-center relative z-10">
          <Link href={`/${locale}/signin`} className="w-full sm:w-auto">
            <Button 
              size="lg" 
              className="w-full sm:w-auto h-16 md:h-20 px-12 rounded-3xl font-black text-xl transition-all hover:scale-105 active:scale-95 bg-white text-zinc-950 hover:bg-zinc-100 dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-900 shadow-2xl"
            >
              {t('ctaButton')}
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}