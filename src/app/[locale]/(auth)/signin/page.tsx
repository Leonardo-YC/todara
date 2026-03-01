import { signIn } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import Image from 'next/image';

export default async function SignInPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className='flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950'>
      <Card className='w-full max-w-[400px] border-none shadow-xl sm:border sm:border-zinc-200 dark:sm:border-zinc-800'>
        <CardHeader className='space-y-2 text-center flex flex-col items-center pb-8'>
          <div className='relative h-20 w-20 sm:h-24 sm:w-24 mb-2'>
            <Image 
              src='/logos/todara-black.svg' 
              alt='Logo Todara' 
              fill
              className='object-contain dark:hidden'
              priority
            />
            <Image 
              src='/logos/todara-white.svg' 
              alt='Logo Todara' 
              fill
              className='object-contain hidden dark:block'
              priority
            />
          </div>

          <CardTitle className='text-2xl font-bold tracking-tight'>
            Bienvenido a Todara
          </CardTitle>
          <CardDescription className='text-balance'>
            Inicia sesión para acceder a tu espacio de trabajo
          </CardDescription>
        </CardHeader>
        
        <CardContent className='grid gap-6'>
          {/* Botones Sociales: Flex-col en móvil, Grid en Tablet+ */}
          <div className='flex flex-col sm:grid sm:grid-cols-2 gap-3'>
            <form action={async () => {
              'use server';
              await signIn('github', { redirectTo: `/${locale}/dashboard/tasks` });
            }}>
              <Button variant='outline' className='w-full border-zinc-200 dark:border-zinc-800' type='submit'>
                <FaGithub className='mr-2 h-4 w-4' />
                GitHub
              </Button>
            </form>
            
            <form action={async () => {
              'use server';
              await signIn('google', { redirectTo: `/${locale}/dashboard/tasks` });
            }}>
              <Button variant='outline' className='w-full border-zinc-200 dark:border-zinc-800' type='submit'>
                <FaGoogle className='mr-2 h-4 w-4 text-red-500' />
                Google
              </Button>
            </form>
          </div>

          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t border-zinc-200 dark:border-zinc-800' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-zinc-50 px-2 text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400'>
                O con Magic Link
              </span>
            </div>
          </div>

          <form action={async (formData) => {
            'use server';
            await signIn('nodemailer', formData);
          }} className='grid gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='email' className='text-xs font-semibold uppercase tracking-wider text-zinc-500'>
                Correo electrónico
              </Label>
              <Input 
                id='email' 
                name='email'
                type='email' 
                placeholder='tu@ejemplo.com' 
                required 
                className='bg-white dark:bg-zinc-900'
              />
            </div>
            <Button className='w-full bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200' type='submit'>
              Enviar enlace mágico
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}