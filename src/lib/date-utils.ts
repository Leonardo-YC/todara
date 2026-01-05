import { format, isToday, isTomorrow, isYesterday, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Convierte una fecha UTC a "YYYY-MM-DD" local SIN cambiar el día.
 */
export function formatLocalYYYYMMDD(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Detecta si una fecha está vencida (Ayer o antes)
 */
export function isOverdue(date: Date | string | null): boolean {
  if (!date) return false;
  const d = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}

/**
 * Formatea una fecha de forma amigable ("Hoy", "Mañana", "Hace 2 días")
 */
export function formatFriendlyDate(date: Date | string | null): string {
  if (!date) return '';
  const d = new Date(date);
  
  // 1. Si está vencida, mostramos tiempo relativo (Ej: "hace 3 días")
  if (isOverdue(d)) {
    return formatDistanceToNow(d, { addSuffix: true, locale: es });
  }

  // 2. Fechas cercanas futuras
  if (isToday(d)) return 'Hoy';
  if (isTomorrow(d)) return 'Mañana';
  if (isYesterday(d)) return 'Ayer'; // Por seguridad, aunque caería en overdue
  
  // 3. Futuro lejano: "Lun, 3 Ene"
  return format(d, 'eee, d MMM', { locale: es });
}