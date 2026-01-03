import { describe, it, expect } from 'vitest';
import { formatDate, isOverdue, getRelativeTime } from './date-format';

describe('formatDate', () => {
  // Usamos una fecha segura (medio día) para evitar problemas de zona horaria
  const testDate = new Date(2024, 11, 25, 12, 0, 0); // 25 Dic 2024 12:00 PM Local

  it('formatea fecha en inglés por defecto', () => {
    const result = formatDate(testDate, 'en');
    expect(result).toContain('December');
    expect(result).toContain('25');
  });

  it('formatea fecha en español', () => {
    const result = formatDate(testDate, 'es');
    expect(result.toLowerCase()).toContain('diciembre');
    expect(result).toContain('25');
  });

  it('devuelve string vacío para fecha inválida', () => {
    expect(formatDate(null)).toBe('');
    expect(formatDate('fecha-loca')).toBe('');
  });
});

describe('isOverdue', () => {
  it('devuelve false para hoy', () => {
    const today = new Date();
    expect(isOverdue(today)).toBe(false);
  });

  it('devuelve false para fecha futura', () => {
    const future = new Date();
    future.setDate(future.getDate() + 5);
    expect(isOverdue(future)).toBe(false);
  });

  it('devuelve true para fecha pasada', () => {
    const past = new Date('2020-01-01');
    expect(isOverdue(past)).toBe(true);
  });
});

describe('getRelativeTime', () => {
  const translations = {
    today: 'Hoy',
    tomorrow: 'Mañana',
    yesterday: 'Ayer'
  };

  it('devuelve traducción de "Hoy" para hoy', () => {
    const today = new Date();
    expect(getRelativeTime(today, translations, 'es')).toBe('Hoy');
  });

  it('devuelve traducción de "Mañana" para mañana', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(getRelativeTime(tomorrow, translations, 'es')).toBe('Mañana');
  });

  it('devuelve traducción de "Ayer" para ayer', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(getRelativeTime(yesterday, translations, 'es')).toBe('Ayer');
  });

  it('devuelve fecha formateada para otros días', () => {
    // CORRECCIÓN: Usamos constructor numérico (Año, Mes-idx, Dia) para usar hora local
    // Mes 0 = Enero. Día 15 para estar lejos de bordes de año.
    const future = new Date(2030, 0, 15); 
    const result = getRelativeTime(future, translations, 'es');
    
    expect(result).not.toBe('Hoy');
    expect(result).not.toBe('Mañana');
    // Ahora sí debería contener 2030 sin importar tu país
    expect(result).toContain('2030'); 
  });
});