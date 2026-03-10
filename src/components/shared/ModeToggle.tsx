'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 w-[84px] h-[42px] border border-zinc-200 dark:border-zinc-800 opacity-50" />
    );
  }

  return (
    <div className="flex items-center gap-2 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 w-fit border border-zinc-200 dark:border-zinc-800">
      <Button
        variant={theme === 'light' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setTheme('light')}
        className="rounded-lg h-8 w-8 p-0 transition-all focus-visible:ring-0 focus-visible:ring-offset-0"
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        variant={theme === 'dark' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setTheme('dark')}
        className="rounded-lg h-8 w-8 p-0 transition-all focus-visible:ring-0 focus-visible:ring-offset-0"
      >
        <Moon className="h-4 w-4" />
      </Button>
    </div>
  );
}