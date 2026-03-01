import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Image from 'next/image';

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const session = await auth();
  const { locale } = await params;

  if (!session?.user) {
    redirect(`/${locale}/signin`);
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white/80 backdrop-blur-md px-4 sm:px-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative h-8 w-8 sm:h-10 sm:w-10">
            <Image 
              src="/logos/todara-black.svg" 
              alt="Logo" 
              fill 
              className="object-contain"
              unoptimized
            />
          </div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight">Todara</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {/* 🔥 Ocultamos el nombre en móviles muy pequeños para evitar desbordes */}
          <span className="hidden xs:block text-sm font-medium text-zinc-600 dark:text-zinc-300">
            Hola, {session.user.name?.split(' ')[0]}
          </span>
          {session.user.image && (
            <img 
              src={session.user.image} 
              alt="Perfil" 
              className="h-8 w-8 rounded-full border border-zinc-200 dark:border-zinc-700 object-cover"
            />
          )}
        </div>
      </header>

      {/* Padding responsivo: p-4 en móvil, p-6 en tablet/desktop */}
      <main className="flex-1 p-4 sm:p-6">
        <div className="mx-auto max-w-5xl w-full">
          {children}
        </div>
      </main>
    </div>
  );
}