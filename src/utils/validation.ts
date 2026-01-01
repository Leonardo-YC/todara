import { TODO_TEXT_MIN_LENGTH, TODO_TEXT_MAX_LENGTH } from '@/lib/constants/validation';

export function validateTodoText(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  const trimmed = text.trim();
  if (trimmed.length < TODO_TEXT_MIN_LENGTH) return false;
  if (trimmed.length > TODO_TEXT_MAX_LENGTH) return false;
  return true;
}

export function sanitizeInput(text: string): string {
  if (!text || typeof text !== 'string') return '';
  return text.trim().replace(/\s+/g, ' ');
}
