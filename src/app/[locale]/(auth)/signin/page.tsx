import { signIn } from '@/lib/auth/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ModeToggle } from '@/components/shared/ModeToggle';
import { LocaleSwitcher } from '@/components/shared/LocaleSwitcher';

export default async function SignInPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('Auth');
  const tCommon = await getTranslations('Common');

  return (
    <div className='flex min-h-[100dvh] flex-col items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950 transition-colors duration-500 overflow-x-hidden relative'>
      
      {/* HEADER RESPONSIVE: Anclado arriba, no interfiere con el centro */}
      <header className="absolute top-0 left-0 right-0 w-full flex items-start justify-between p-4 sm:p-6 lg:p-8 z-20">
        <Link href={`/${locale}`}>
          <Button variant="ghost" className="rounded-full gap-2 font-bold text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 text-sm md:text-base">
            <ChevronLeft className="h-4 w-4" />
            {tCommon('back')}
          </Button>
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          <LocaleSwitcher />
          <ModeToggle />
        </div>
      </header>

      {/* CAJA DE LOGIN: Tamaño Boutique fijo (máx 420px) sin generar scroll */}
      <div className="w-full max-w-[420px] z-10 mt-12 sm:mt-0">
        <Card className='w-full shadow-2xl shadow-zinc-200/50 dark:shadow-black/80 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden'>
          <CardHeader className='space-y-4 text-center flex flex-col items-center pt-8 sm:pt-10 pb-6 px-4 sm:px-6'>
            
            {/* 🔥 LOGO STRICT: Siempre h-32 w-32 como lo pediste */}
            <div className="relative h-32 w-32 mb-2 p-6 rounded-[3rem] bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 shadow-inner flex items-center justify-center group transition-transform hover:scale-105">
              <div className="relative h-full w-full">
                <Image 
                  src="/logos/todara-logo.svg" 
                  alt="Todara Logo" 
                  fill 
                  className="object-contain drop-shadow-sm" 
                />
              </div>
            </div>
            
            <div className='space-y-1.5 px-2'>
              <CardTitle className='text-3xl sm:text-4xl font-black tracking-tighter leading-tight text-zinc-900 dark:text-white'>
                {t('signInTitle')}
              </CardTitle>
              <CardDescription className='text-zinc-500 dark:text-zinc-400 font-medium text-sm sm:text-base'>
                {t('signInSubtitle')}
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className='grid gap-6 px-6 sm:px-8 pb-8 sm:pb-10'>
            {/* BOTONES SOCIALES */}
            <div className='grid grid-cols-2 gap-3'>
              <form action={async () => {
                'use server';
                await signIn('github', { redirectTo: `/${locale}/dashboard/tasks` });
              }}>
                <Button variant='outline' className='w-full h-12 rounded-xl border-zinc-200 dark:border-zinc-800 font-bold hover:bg-zinc-50 dark:hover:bg-zinc-950/50 text-sm' type='submit'>
                  <FaGithub className='mr-2 h-4 w-4 text-zinc-900 dark:text-white' />
                  <span className="text-zinc-900 dark:text-white">GitHub</span>
                </Button>
              </form>
              
              <form action={async () => {
                'use server';
                await signIn('google', { redirectTo: `/${locale}/dashboard/tasks` });
              }}>
                <Button variant='outline' className='w-full h-12 rounded-xl border-zinc-200 dark:border-zinc-800 font-bold hover:bg-zinc-50 dark:hover:bg-zinc-950/50 text-sm' type='submit'>
                  <FaGoogle className='mr-2 h-4 w-4 text-red-500' />
                  <span className="text-zinc-900 dark:text-white">Google</span>
                </Button>
              </form>
            </div>

            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t border-zinc-100 dark:border-zinc-800' />
              </div>
              <div className='relative flex justify-center text-[10px] uppercase tracking-widest font-black'>
                <span className='bg-white dark:bg-zinc-900 px-4 text-zinc-400 dark:text-zinc-500'>
                  {t('magicLinkDivider')}
                </span>
              </div>
            </div>

            <form action={async (formData) => {
              'use server';
              await signIn('nodemailer', { 
                email: formData.get('email'), 
                redirectTo: `/${locale}/dashboard/tasks` 
              });
            }} className='grid gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='email' className='text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1'>
                  {t('emailLabel')}
                </Label>
                <Input 
                  id='email' 
                  name='email'
                  type='email' 
                  placeholder={t('emailPlaceholder')} 
                  required 
                  className='h-12 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-xl focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 text-sm'
                />
              </div>
              <Button className='w-full h-14 rounded-2xl bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 font-black text-lg shadow-xl transition-all active:scale-95' type='submit'>
                {t('sendMagicLink')}
              </Button>
            </form>

            {/* 🔥 TEXTO LEGAL: Más grande y con mejor contraste (text-xs font-medium) */}
            <p className='text-xs text-center text-zinc-500 dark:text-zinc-400 leading-relaxed px-2 sm:px-4 pt-2 font-medium'>
              {t('legalStart')}
              <Link href={`/${locale}/legal/terms`} className='underline underline-offset-2 hover:text-zinc-900 dark:hover:text-zinc-100 font-bold'>{t('legalTerms')}</Link> 
              {' '}{t('legalAnd')}{' '}
              <Link href={`/${locale}/legal/privacy`} className='underline underline-offset-2 hover:text-zinc-900 dark:hover:text-zinc-100 font-bold'>{t('legalPrivacy')}</Link>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}