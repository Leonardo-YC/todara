import type { Locale } from '@/types';

export function formatDate(date: Date | string | null, locale: Locale = 'en'): string {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function isOverdue(date: Date | string): boolean {
  if (!date) return false;
  const d = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(d);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate < today;
}

// CORRECCIÓN AQUÍ: Cambiamos 'string' por 'Locale'
export function getRelativeTime(date: Date | string, locale: Locale = 'en'): string {
  const d = new Date(date);
  // Por ahora reutilizamos formatDate
  return formatDate(d, locale);
}