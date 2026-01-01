/**
 * Rate limiting using Upstash Redis
 */
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Inicializar cliente de Redis (leerá autom. del archivo .env)
const redis = Redis.fromEnv();

// Limitador estándar (10 peticiones por minuto)
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  analytics: true,
  prefix: 'todara',
});

// Limitador estricto para mutaciones (Crear/Borrar/Editar: 5 por minuto)
export const ratelimitMutations = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  analytics: true,
  prefix: 'todara:mutations',
});

// Limitador relajado para lecturas (Ver tareas: 100 por minuto)
export const ratelimitReads = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true,
  prefix: 'todara:reads',
});

/**
 * Función helper para verificar el límite
 */
export async function checkRateLimit(
  identifier: string,
  type: 'default' | 'mutations' | 'reads' = 'default'
) {
  let limiter: Ratelimit;

  switch (type) {
    case 'mutations':
      limiter = ratelimitMutations;
      break;
    case 'reads':
      limiter = ratelimitReads;
      break;
    default:
      limiter = ratelimit;
  }

  // Verificar límite
  const { success, limit, remaining, reset } = await limiter.limit(identifier);

  return { success, limit, remaining, reset };
}

/**
 * Obtener headers HTTP para la respuesta
 */
export function getRateLimitHeaders(result: {
  limit: number;
  remaining: number;
  reset: number;
}) {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
  };
}