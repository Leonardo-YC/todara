import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from './mocks/server';
import { resetMockTodos } from './mocks/handlers';

// 1. Mocks de APIs del navegador que no existen en JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  }),
});

// Mock de IntersectionObserver (usado por algunas librerías de UI)
const IntersectionObserverMock = function () {
  return {
    observe: () => null,
    disconnect: () => null,
    unobserve: () => null,
  };
};
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
});

// 2. Configuración del Servidor MSW (API Mock)
// Iniciar servidor antes de todos los tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Limpiar después de cada test individual
afterEach(() => {
  cleanup(); // Limpia el DOM de React
  server.resetHandlers(); // Resetea los manejadores de red
  resetMockTodos(); // Resetea tu array de todos falsos
  localStorage.clear(); // Limpia localStorage
});

// Cerrar servidor al terminar todo
afterAll(() => server.close());