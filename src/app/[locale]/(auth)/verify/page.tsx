import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

export default async function VerifyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('Auth');

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950 transition-colors duration-500 overflow-x-hidden'>
      
      {/* LOGO BOUTIQUE FLOTANTE XL */}
      <div className="relative h-32 w-32 mb-8 p-6 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl flex items-center justify-center">
         <Image src="/logos/todara-logo.svg" alt="Todara" fill className="p-4 object-contain" />
      </div>

      <Card className='w-full max-w-md border-none shadow-2xl text-center py-10 rounded-[3.5rem] bg-white dark:bg-zinc-900 mx-auto'>
        <CardHeader className="px-6 space-y-4">
          {/* ICONO DEL CORREO XL (Ajustado para armonía) */}
          <div className='mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-[3rem] bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 text-zinc-900 dark:text-white shadow-inner'>
            <Mail className='h-14 w-14 animate-bounce' />
          </div>
          
          <div className="space-y-1">
            <CardTitle className='text-3xl font-black tracking-tighter leading-none'>{t('verifyTitle')}</CardTitle>
            <CardDescription className='text-base px-2 font-medium mt-2'>
              {t('verifySubtitle')}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className='space-y-8 px-8'>
          <p className='text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed px-2'>
            {t('verifyDesc')}
          </p>
          <div className='pt-2'>
            <Link href={`/${locale}/signin`}>
              <Button variant='ghost' className='text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 font-black gap-2 transition-colors'>
                <ChevronLeft className="h-4 w-4" />
                {t('verifyBack')}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}