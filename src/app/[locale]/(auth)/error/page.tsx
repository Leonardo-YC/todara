import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function ErrorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className='flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950'>
      <Card className='w-full max-w-md border-none shadow-xl text-center border-t-4 border-t-red-500'>
        <CardHeader>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30'>
            <span className='text-3xl'>⚠️</span>
          </div>
          <CardTitle className='text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100'>
            Ups, algo salió mal
          </CardTitle>
          <CardDescription>
            No pudimos completar tu inicio de sesión.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <p className='text-sm text-zinc-500 dark:text-zinc-400'>
            Esto suele pasar si el enlace de correo ya expiró o si cancelaste el acceso en Google/GitHub. 
          </p>
          <Link href={`/${locale}/signin`} className='block'>
            <Button className='w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200'>
              Intentar de nuevo
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}