import { rateLimit } from 'express-rate-limit';

/**
 * Aplica rate limiting a los endpoints de autenticación.
 * - Limita a 10 intentos por IP cada 15 minutos.
 * - Los mensajes de error son JSON para ser consistentes con la API.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    ok: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
    data: null,
  },
  skipSuccessfulRequests: false,
});

/**
 * Rate limiter más estricto para el endpoint de login
 * (previene fuerza bruta de credenciales).
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    ok: false,
    message: 'Too many login attempts, please try again after 15 minutes',
    data: null,
  },
  skipSuccessfulRequests: true, // No cuenta los logins exitosos
});
