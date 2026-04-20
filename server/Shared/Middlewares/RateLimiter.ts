import { rateLimit } from 'express-rate-limit';


export class RateLimiter{
/**
 * Aplica rate limiting a los endpoints de autenticación.
 * - Limita a 10 intentos por IP cada 15 minutos.
 * - Los mensajes de error son JSON para ser consistentes con la API.
 */
static authRateLimiter = rateLimit({
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
static loginRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    ok: false,
    message: 'Demasiados intentos de login, por favor intente nuevamente en 15 minutos',
    data: null,
  },
  skipSuccessfulRequests: true, // No cuenta los logins exitosos
});
}