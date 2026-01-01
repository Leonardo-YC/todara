import { clsx, type ClassValue } from 'clsx';

/**
 * Combina nombres de clases condicionalmente (Versión CSS Modules)
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}