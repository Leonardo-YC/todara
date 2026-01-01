/**
 * Input sanitization functions
 */
import DOMPurify from 'isomorphic-dompurify';

/**
 * Elimina etiquetas HTML (XSS protection)
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [], // No permitimos ninguna etiqueta HTML
    KEEP_CONTENT: true, // Mantenemos el texto
  });
}

/**
 * Limpia el texto de una tarea
 */
export function sanitizeTodoText(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // 1. Eliminar HTML malicioso
  let sanitized = sanitizeHtml(text);

  // 2. Quitar espacios extra a los lados
  sanitized = sanitized.trim();

  // 3. Reemplazar múltiples espacios por uno solo
  sanitized = sanitized.replace(/\s+/g, ' ');

  return sanitized;
}