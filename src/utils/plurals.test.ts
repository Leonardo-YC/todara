import { describe, it, expect } from 'vitest';
import { getTodoCountText } from './plurals';

describe('getTodoCountText', () => {
  describe('Español (es)', () => {
    it('devuelve singular para 1 tarea', () => {
      expect(getTodoCountText(1, 'es')).toBe('1 tarea pendiente');
    });

    it('devuelve plural para varias tareas', () => {
      expect(getTodoCountText(2, 'es')).toBe('2 tareas pendientes');
      expect(getTodoCountText(0, 'es')).toBe('0 tareas pendientes');
    });
  });

  describe('Inglés (en)', () => {
    it('devuelve singular para 1 item', () => {
      expect(getTodoCountText(1, 'en')).toBe('1 item left');
    });

    it('devuelve plural para varios items', () => {
      expect(getTodoCountText(5, 'en')).toBe('5 items left');
    });
  });
});