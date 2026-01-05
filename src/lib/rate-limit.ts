/**
 * Rate limiting using Upstash Redis
 */
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Inicializar cliente de Redis
// Si no hay variables de entorno (ej. en build local sin .env), evitamos que explote
const redis = process.env.UPSTASH_REDIS_REST_URL 
  ? Redis.fromEnv() 
  : new Redis({ url: 'http://localhost:6379', token: 'example' }); // Fallback dummy

// 1. Limitador estándar (Aumentado a 20)
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '1 m'), // Subido un poco
  analytics: true,
  prefix: 'todara',
});

// 2. Limitador para mutaciones (Aumentado a 20 para producción)
export const ratelimitMutations = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '1 m'), // 5 era muy poco, subimos a 20
  analytics: true,
  prefix: 'todara:mutations',
});

// 3. Limitador para lecturas
export const ratelimitReads = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(200, '1 m'),
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
  // ✅ BYPASS PARA DESARROLLO:
  // Si estamos en localhost, devolvemos éxito siempre y no gastamos Redis.
  if (process.env.NODE_ENV === 'development') {
    return {
      success: true,
      limit: 1000,
      remaining: 999,
      reset: 0,
    };
  }

  // Si no hay Redis configurado, también dejamos pasar (para evitar errores en build)
  if (!process.env.UPSTASH_REDIS_REST_URL) {
    console.warn('⚠️ Redis no configurado, saltando rate limit.');
    return { success: true, limit: 1000, remaining: 999, reset: 0 };
  }

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

  // Verificar límite real en Producción
  try {
    const { success, limit, remaining, reset } = await limiter.limit(identifier);
    return { success, limit, remaining, reset };
  } catch (error) {
    console.error('Error en Rate Limit (Redis):', error);
    // Si Redis falla (caída de servicio), dejamos pasar al usuario para no bloquear la app
    return { success: true, limit: 10, remaining: 10, reset: 0 };
  }
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