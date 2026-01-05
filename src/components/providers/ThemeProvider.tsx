'use client';

import * as React from 'react';
// ✅ CORRECCIÓN: Importamos todo desde 'next-themes'
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}