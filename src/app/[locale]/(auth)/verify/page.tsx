import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ModeToggle } from '@/components/shared/ModeToggle';
import { LocaleSwitcher } from '@/components/shared/LocaleSwitcher';

export default async function VerifyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('Auth');

  return (
    <div className='flex min-h-[100dvh] flex-col items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950 transition-colors duration-500 overflow-x-hidden relative'>
      
      {/* HEADER RESPONSIVE: Selector de idioma y tema anclados arriba */}
      <header className="absolute top-0 left-0 right-0 w-full flex items-start justify-end p-4 sm:p-6 lg:p-8 z-20">
        <div className="flex items-center gap-2 md:gap-4">
          <LocaleSwitcher />
          <ModeToggle />
        </div>
      </header>

      {/* CAJA DE VERIFICACIÓN: Tamaño Boutique idéntico al Login y Error (máx 420px) sin scroll */}
      <div className="w-full max-w-[420px] z-10 mt-12 sm:mt-0">
        <Card className='w-full shadow-2xl shadow-zinc-200/50 dark:shadow-black/80 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden'>
          
          <CardHeader className='space-y-4 text-center flex flex-col items-center pt-8 sm:pt-10 pb-4 px-4 sm:px-6'>
            
            {/* LOGO: Estricto h-32 w-32 con el badge de correo */}
            <div className="relative h-32 w-32 mb-2 p-6 rounded-[3rem] bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 shadow-inner flex items-center justify-center group transition-transform hover:scale-105">
              <div className="relative h-full w-full">
                <Image 
                  src="/logos/todara-logo.svg" 
                  alt="Todara Logo" 
                  fill 
                  className="object-contain drop-shadow-sm" 
                />
              </div>
              {/* Badge de correo superpuesto al logo (con una ligera animación) */}
              <div className="absolute -bottom-2 -right-2 bg-white dark:bg-zinc-900 p-2.5 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-800">
                <Mail className="h-6 w-6 text-zinc-900 dark:text-white animate-pulse" />
              </div>
            </div>
            
            <div className='space-y-1.5 px-2 mt-4'>
              <CardTitle className='text-3xl sm:text-4xl font-black tracking-tighter leading-tight text-zinc-900 dark:text-white'>
                {t('verifyTitle')}
              </CardTitle>
              <CardDescription className='text-sm sm:text-base font-bold text-zinc-600 dark:text-zinc-400'>
                {t('verifySubtitle')}
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className='grid gap-8 px-6 sm:px-8 pb-8 sm:pb-10 text-center'>
            
            <p className='text-sm sm:text-base text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed'>
              {t('verifyDesc')}
            </p>
            
            {/* BOTÓN VOLVER AL INICIO */}
            <div className='pt-2'>
              <Link href={`/${locale}/signin`}>
                <Button variant='ghost' className='text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 font-black gap-2 transition-colors rounded-full'>
                  <ChevronLeft className="h-4 w-4" />
                  {t('verifyBack')}
                </Button>
              </Link>
            </div>
            
          </CardContent>
        </Card>
      </div>

    </div>
  );
}