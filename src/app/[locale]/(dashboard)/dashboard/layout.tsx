import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { NavbarMobile } from '@/components/layout/NavbarMobile';
import { getMascotStatus } from '@/actions/tasks-actions'; // 🔥 Importado

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const session = await auth();
  const { locale } = await params;

  if (!session?.user) redirect(`/${locale}/signin`);

  // 🔥 Calculamos el humor de Sofi una sola vez
  const mascotState = await getMascotStatus() as 'neutral' | 'happy' | 'alert';

  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-zinc-950 transition-colors duration-500">
      
      {/* 🟢 Pasamos el estado al Sidebar de PC */}
      <Sidebar locale={locale} mascotState={mascotState} />

      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        {/* ⚪ 🔥 FIX: Ahora SÍ pasamos mascotState al NavbarMobile */}
        <NavbarMobile locale={locale} session={session} mascotState={mascotState} />

        <main className="flex-1 overflow-y-auto bg-zinc-50/50 dark:bg-zinc-950/50">
          <div className="p-4 sm:p-6 lg:p-10 mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}