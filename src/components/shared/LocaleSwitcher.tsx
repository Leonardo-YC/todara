'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const onSelectChange = (nextLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-2 p-1 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 h-[42px] border border-zinc-200 dark:border-zinc-800 transition-all">
      <Globe className="h-4 w-4 text-zinc-500 shrink-0" />
      <Select defaultValue={locale} onValueChange={onSelectChange}>
        {/* 🔥 FIX: Eliminamos el focus ring con clases específicas */}
        <SelectTrigger className="border-none bg-transparent h-full p-0 text-sm font-medium text-zinc-900 dark:text-zinc-100 w-fit gap-2 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none outline-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-zinc-200 dark:border-zinc-800">
          <SelectItem value="es" className="text-sm font-medium">Español</SelectItem>
          <SelectItem value="en" className="text-sm font-medium">English</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}