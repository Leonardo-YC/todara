/**
 * MSW server for Node.js (testing)
 */
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Configuramos el servidor con los manejadores definidos
export const server = setupServer(...handlers);