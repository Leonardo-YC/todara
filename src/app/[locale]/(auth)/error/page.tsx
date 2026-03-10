import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

export default async function AuthErrorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('Auth');

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-white p-4 dark:bg-zinc-950 transition-colors duration-500 overflow-x-hidden'>
      
      {/* LOGO BOUTIQUE XL */}
      <div className="relative h-32 w-32 mb-8 p-6 rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-xl flex items-center justify-center transition-transform hover:scale-105">
         <Image src="/logos/todara-logo.svg" alt="Todara" fill className="p-4 object-contain" />
      </div>

      <Card className='w-full max-w-md border-none shadow-2xl text-center py-10 rounded-[3.5rem] bg-white dark:bg-zinc-900/50 border sm:border-zinc-100 dark:sm:border-zinc-800'>
        <CardHeader className="px-6 space-y-4">
          <div className='mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-[3rem] bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30'>
            <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-500" />
          </div>
          <div className="space-y-1">
            <CardTitle className='text-3xl font-black tracking-tighter text-zinc-900 dark:text-white leading-none'>{t('errorTitle')}</CardTitle>
            <CardDescription className='text-lg font-bold text-red-600 dark:text-red-400 mt-2'>{t('errorSubtitle')}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className='space-y-8 px-8'>
          <p className='text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed px-4'>{t('errorDesc')}</p>
          
          {/* 🔥 BOTÓN CORREGIDO: Más pequeño y elegante */}
          <div className="flex justify-center pt-2">
            <Link href={`/${locale}/signin`} className="w-full sm:w-auto">
              <Button className='h-14 px-10 rounded-2xl font-bold text-base bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-lg hover:scale-105 active:scale-95 transition-all gap-2'>
                <RotateCcw className="h-5 w-5" />
                {t('errorButton')}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}