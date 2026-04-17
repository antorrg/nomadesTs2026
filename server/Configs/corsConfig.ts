import type { CorsOptions } from 'cors'


const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:4173',
  'http://localhost:4173',
  'http://127.0.0.1:4000',
  'http://localhost:4000'
]


export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    // Permite requests sin origin (ej: Postman / Thunder)
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('CORS: Origin no permitido'), false)
    }
  },
  credentials: true, // <- NECESARIO para cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH','DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}

