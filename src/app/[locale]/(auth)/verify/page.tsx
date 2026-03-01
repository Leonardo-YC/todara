import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function VerifyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className='flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950'>
      <Card className='w-full max-w-md border-none shadow-xl text-center py-6'>
        <CardHeader>
          <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800'>
            <span className='text-3xl animate-pulse'>📧</span>
          </div>
          <CardTitle className='text-2xl font-bold tracking-tight'>Revisa tu correo</CardTitle>
          <CardDescription className='text-base px-4'>
            Te hemos enviado un enlace mágico de acceso directo.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <p className='text-sm text-zinc-500 dark:text-zinc-400'>
            Haz clic en el botón del correo para entrar. Si no aparece, espera un minuto o revisa la carpeta de spam.
          </p>
          <div className='pt-2'>
            <Link href={`/${locale}/signin`}>
              <Button variant='ghost' className='text-zinc-500 hover:text-zinc-900'>
                ← Volver al inicio
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}