import { auth } from '@/lib/auth/auth';
import { ModeToggle } from '@/components/shared/ModeToggle';
import { LocaleSwitcher } from '@/components/shared/LocaleSwitcher';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { LogOut, User, Palette, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { signOut } from '@/lib/auth/auth';
import { getTranslations, getLocale } from 'next-intl/server'; // 🔥 FIX: Importamos getLocale

export default async function SettingsPage() {
  const t = await getTranslations('Settings');
  const locale = await getLocale(); // 🔥 FIX: Obtenemos el idioma actual
  const session = await auth();

  // 🔥 Lógica de Iniciales: Tamaño ajustado para ser elegante, no excesivo
  const userInitials = session?.user?.name
    ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-4 sm:px-0">
      {/* CABECERA: Tamaño reducido a text-3xl para Dashboard */}
      <div className="space-y-1">
        <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
          {t('title')}
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-base font-medium">
          {t('description')}
        </p>
      </div>

      <div className="grid gap-8">
        {/* SECCIÓN PERFIL */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1 text-zinc-400 uppercase tracking-[0.2em] text-[10px] font-black">
            <User className="h-3.5 w-3.5" />
            {t('profileTitle')}
          </div>
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                {/* AVATAR: Tamaño corregido de 32 a 20 (80px) - mucho más balanceado */}
                <div className="relative shrink-0">
                  {session?.user?.image ? (
                    <img 
                      src={session.user.image} 
                      className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl sm:rounded-3xl border-2 border-zinc-50 dark:border-zinc-900 shadow-lg object-cover" 
                      alt="Avatar" 
                    />
                  ) : (
                    <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl sm:rounded-3xl bg-zinc-950 dark:bg-white flex items-center justify-center shadow-lg">
                       <span className="text-2xl sm:text-3xl font-black text-white dark:text-zinc-950">
                         {userInitials}
                       </span>
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 bg-white dark:bg-zinc-900 p-1 rounded-full shadow-md border border-zinc-100 dark:border-zinc-800">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                </div>

                <div className="text-center sm:text-left space-y-1">
                  <p className="font-bold text-xl sm:text-2xl text-zinc-900 dark:text-zinc-100 tracking-tight">
                    {session?.user?.name || 'Usuario Todara'}
                  </p>
                  <p className="text-zinc-500 font-medium text-sm sm:text-base">{session?.user?.email}</p>
                  <div className="inline-flex mt-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100 dark:border-emerald-900">
                    Cuenta Verificada
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* SECCIÓN APARIENCIA */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1 text-zinc-400 uppercase tracking-[0.2em] text-[10px] font-black">
            <Palette className="h-3.5 w-3.5" />
            {t('appearanceTitle')}
          </div>
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950 rounded-[1.5rem] sm:rounded-[2rem]">
            <CardContent className="p-0 divide-y divide-zinc-100 dark:divide-zinc-900">
              <div className="flex items-center justify-between p-6 sm:p-8">
                <div className="space-y-0.5">
                  <Label className="text-zinc-900 dark:text-zinc-100 font-bold text-base sm:text-lg tracking-tight">{t('colorMode')}</Label>
                  <p className="text-xs sm:text-sm text-zinc-500 font-medium">{t('colorModeDesc')}</p>
                </div>
                <ModeToggle />
              </div>
              
              <div className="flex items-center justify-between p-6 sm:p-8">
                <div className="space-y-0.5">
                  <Label className="text-zinc-900 dark:text-zinc-100 font-bold text-base sm:text-lg tracking-tight">{t('language')}</Label>
                  <p className="text-xs sm:text-sm text-zinc-500 font-medium">{t('languageDesc')}</p>
                </div>
                <LocaleSwitcher />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ZONA DE CIERRE DE SESIÓN: Compacta y segura */}
        <Card className="border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-[1.5rem] sm:rounded-[2rem] mt-4">
          <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 shadow-sm shrink-0">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div className="text-center sm:text-left space-y-0.5">
                <p className="font-bold text-zinc-900 dark:text-zinc-100 text-base sm:text-lg">Sesión Segura</p>
                <p className="text-xs sm:text-sm text-zinc-500 max-w-[240px] font-medium leading-tight">Tu sesión está protegida. Al salir, deberás usar un nuevo Magic Link.</p>
              </div>
            </div>
            <form
              action={async () => {
                'use server';
                // 🔥 FIX: Le decimos a Auth.js que te mande a la Landing al salir
                await signOut({ redirectTo: `/${locale}` });
              }}
              className="w-full sm:w-auto"
            >
              <Button 
                variant="destructive" 
                className="w-full sm:w-auto gap-2 rounded-xl px-8 h-12 font-bold text-sm text-white bg-red-600 hover:bg-red-700 shadow-md transition-all active:scale-95"
              >
                <LogOut className="h-4 w-4 text-white" />
                {t('logout')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}