import { Monitor, Smartphone, WifiOff } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function InstallGuide() {
  const t = useTranslations('Installation');

  return (
    <section className="py-24 bg-white dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-zinc-900 dark:text-white">
            {t('title')}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed">
            {t('description')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* PC */}
          <div className="p-8 rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 space-y-4 transition-transform hover:-translate-y-1 duration-300">
            <div className="h-12 w-12 bg-white dark:bg-zinc-950 rounded-2xl flex items-center justify-center shadow-sm border border-zinc-100 dark:border-zinc-800">
              <Monitor className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
            </div>
            <h3 className="font-bold text-xl text-zinc-900 dark:text-white">{t('step1Title')}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
              {t('step1Desc')}
            </p>
          </div>

          {/* Móvil */}
          <div className="p-8 rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 space-y-4 transition-transform hover:-translate-y-1 duration-300">
            <div className="h-12 w-12 bg-white dark:bg-zinc-950 rounded-2xl flex items-center justify-center shadow-sm border border-zinc-100 dark:border-zinc-800">
              <Smartphone className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
            </div>
            <h3 className="font-bold text-xl text-zinc-900 dark:text-white">{t('step2Title')}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
              {t('step2Desc')}
            </p>
          </div>

          {/* Offline */}
          <div className="p-8 rounded-[2.5rem] bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 space-y-4 transition-transform hover:-translate-y-1 duration-300 shadow-xl">
            <div className="h-12 w-12 bg-white/10 dark:bg-zinc-900/10 rounded-2xl flex items-center justify-center">
              <WifiOff className="h-5 w-5 text-white dark:text-zinc-950" />
            </div>
            <h3 className="font-bold text-xl">{t('offlineTitle')}</h3>
            <p className="text-sm opacity-80 leading-relaxed font-medium">
              {t('offlineDesc')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}