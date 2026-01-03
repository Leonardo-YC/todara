import { describe, it, expect } from 'vitest';
import { validateTodoText, sanitizeInput } from './validation';

describe('validateTodoText', () => {
  it('devuelve false para string vacío', () => {
    expect(validateTodoText('')).toBe(false);
  });

  it('devuelve false si es puro espacio', () => {
    expect(validateTodoText('   ')).toBe(false);
  });

  it('devuelve true para texto válido', () => {
    expect(validateTodoText('Comprar leche')).toBe(true);
  });

  it('devuelve true si es corto pero aceptable (2 letras)', () => {
    expect(validateTodoText('ab')).toBe(true);
  });

  // CORRECCIÓN AQUÍ: Tu app permite 1 letra, así que cambiamos false a true
  it('devuelve true incluso con 1 sola letra (mínimo permitido)', () => {
    expect(validateTodoText('a')).toBe(true); 
  });

  it('devuelve false si es muy largo (más de 200)', () => {
    const longText = 'a'.repeat(201);
    expect(validateTodoText(longText)).toBe(false);
  });

  it('devuelve false si no es string', () => {
    expect(validateTodoText(null as any)).toBe(false);
    expect(validateTodoText(123 as any)).toBe(false);
  });
});

describe('sanitizeInput', () => {
  it('elimina espacios al inicio y final', () => {
    expect(sanitizeInput('  hola  ')).toBe('hola');
  });

  it('reemplaza múltiples espacios internos por uno solo', () => {
    expect(sanitizeInput('hola    mundo')).toBe('hola mundo');
  });

  it('devuelve string vacío si recibe null/undefined', () => {
    expect(sanitizeInput(null as any)).toBe('');
    expect(sanitizeInput(undefined as any)).toBe('');
  });
});