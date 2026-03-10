'use client';

import { useState, useEffect } from 'react'; 
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';
import { ModeToggle } from '@/components/shared/ModeToggle';
import { LocaleSwitcher } from '@/components/shared/LocaleSwitcher';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import { useTranslations } from 'next-intl'; 

// 🔥 FIX: Añadimos mascotState a las props
export function NavbarMobile({ 
  locale, 
  session,
  mascotState = 'neutral' 
}: { 
  locale: string; 
  session: any;
  mascotState?: 'neutral' | 'happy' | 'alert'
}) {
  const [open, setOpen] = useState(false); 
  const pathname = usePathname();
  const tLayout = useTranslations('Layout'); 

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white/80 px-4 sm:px-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80 shrink-0">
      
      <div className="flex items-center lg:hidden">
        <Link href={`/${locale}`} className="flex items-center gap-3 font-semibold group">
          <div className="relative h-8 w-8 transition-transform group-hover:scale-110">
            <Image 
              src="/logos/todara-logo.svg" 
              alt="Todara" 
              fill 
              className="object-contain" 
            />
          </div>
          <span className="text-lg tracking-tight font-bold text-zinc-950 dark:text-white">
            Todara
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 ml-auto">
        
        <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <ModeToggle />
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300">
            {session.user.name?.split(' ')[0]}
          </span>
          {session.user.image ? (
            <img 
              src={session.user.image} 
              alt="Perfil" 
              className="h-9 w-9 rounded-full border border-zinc-200 dark:border-zinc-700 object-cover shadow-sm"
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold border border-zinc-200 dark:border-zinc-700">
              {session.user.name?.charAt(0)}
            </div>
          )}
        </div>

        <div className="lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:scale-95 transition-transform"
              >
                <Menu className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
              </Button>
            </SheetTrigger>
            
            <SheetContent 
              side="right" 
              className="w-[280px] p-0 border-zinc-200 dark:border-zinc-800 outline-none focus:outline-none [&>button]:focus:ring-0 [&>button]:ring-offset-0 [&>button]:outline-none [&>button]:focus-visible:outline-none"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>{tLayout('menuTitle')}</SheetTitle>
              </SheetHeader>
              {/* 🔥 FIX: Le pasamos el mascotState al Sidebar móvil */}
              <Sidebar locale={locale} isMobile mascotState={mascotState} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}