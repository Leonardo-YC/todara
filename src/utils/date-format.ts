import type { Locale } from '@/types';

/**
 * Formatea una fecha según el locale
 */
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

/**
 * Verifica si una fecha está vencida
 */
export function isOverdue(date: Date | string): boolean {
  if (!date) return false;
  const d = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(d);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate < today;
}

/**
 * Calcula el texto relativo (Hoy, Mañana, Ayer) usando las traducciones pasadas
 * @param date La fecha a formatear
 * @param t Función de traducción o objeto con keys { today, tomorrow, yesterday }
 * @param locale El idioma actual
 */
export function getRelativeTime(
  date: Date | string, 
  translations: { today: string; tomorrow: string; yesterday: string },
  locale: Locale = 'en'
): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const checkDate = new Date(d);
  checkDate.setHours(0, 0, 0, 0);

  const diffTime = checkDate.getTime() - today.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return translations.today;
  if (diffDays === 1) return translations.tomorrow;
  if (diffDays === -1) return translations.yesterday;

  return formatDate(d, locale);
}