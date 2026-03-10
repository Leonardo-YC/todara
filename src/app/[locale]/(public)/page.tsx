'use client';

import { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Zap, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MascotFeedback from '@/components/shared/MascotFeedback';
import { useTranslations } from 'next-intl';
import { InstallGuide } from '@/components/layout/InstallGuide'; // 🔥 IMPORTAMOS LA GUÍA

export default function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations('Landing');

  const scrollToFeatures = () => {
    const element = document.getElementById('features');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="overflow-x-hidden">
      <section className="px-6 pt-6 pb-20 md:pt-10 md:pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mb-8">
            <Sparkles className="h-3 w-3 text-yellow-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              {t('badge')}
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter text-zinc-900 dark:text-white mb-6 leading-[0.9]">
            {t('titleMain')} <span className="text-zinc-400">{t('titleStyle')}</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto mb-10 font-medium px-4">
            {t('description')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-6">
            <Link href={`/${locale}/signin`} className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 rounded-2xl text-lg font-black shadow-2xl shadow-zinc-900/20 dark:shadow-white/10 transition-all hover:scale-105 active:scale-95 gap-2 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                {t('buttonStart')} <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Button 
              onClick={scrollToFeatures}
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto h-14 px-8 rounded-2xl text-lg font-bold border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              {t('buttonFeatures')}
            </Button>
          </div>
        </motion.div>

        {/* Sofi Feedback Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-16 flex justify-center"
        >
          <div className="relative group p-4">
            <div className="absolute -inset-1 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-white dark:bg-zinc-950 p-8 md:p-12 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-2xl transition-transform group-hover:scale-[1.02]">
              <MascotFeedback state="happy" size={140} />
              <p className="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 dark:text-zinc-600">
                {t('mascotWait')}
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-zinc-50 dark:bg-zinc-900/50 py-24 border-y border-zinc-100 dark:border-zinc-900">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">{t('featuresTitle')}</h2>
            <div className="h-1.5 w-12 bg-zinc-900 dark:bg-white mx-auto rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Zap, title: t('feat1Title'), desc: t('feat1Desc') },
              { icon: CheckCircle2, title: t('feat2Title'), desc: t('feat2Desc') },
              { icon: Shield, title: t('feat3Title'), desc: t('feat3Desc') }
            ].map((feature, i) => (
              <div key={i} className="space-y-4 p-2">
                <div className="h-12 w-12 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center shadow-sm">
                  <feature.icon className="h-6 w-6 text-zinc-950 dark:text-white" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">{feature.title}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔥 NUEVA SECCIÓN: Guía de Instalación */}
      <InstallGuide />

    </main>
  );
}