import type { Locale } from '@/types';

export function getTodoCountText(count: number, locale: Locale = 'en'): string {
  if (locale === 'es') {
    return count === 1 ? `${count} tarea pendiente` : `${count} tareas pendientes`;
  }
  return count === 1 ? `${count} item left` : `${count} items left`;
}
