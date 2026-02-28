import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Validamos que la variable de entorno exista (buena práctica de ingeniería)
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing from .env');
}

// Conexión HTTP Serverless (Ideal para Next.js)
const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });