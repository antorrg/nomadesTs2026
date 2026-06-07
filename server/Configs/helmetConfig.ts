import helmet, { type HelmetOptions, } from 'helmet'
import envConfig from './envConfig.js'


const commonCspDirectives = {
  defaultSrc: ["'self'"],

  scriptSrc: [
    "'self'",

    // YouTube
    'https://www.youtube.com',

    // Meta embeds / SDKs
    'https://www.instagram.com',
    'https://www.facebook.com',
    'https://connect.facebook.net'
  ],

  styleSrc: [
    "'self'",
    "'unsafe-inline'"
  ],

  imgSrc: [
    "'self'",
    'data:',
    'blob:',

    // Cloudinary
    'https://res.cloudinary.com',

    // YouTube thumbnails
    'https://i.ytimg.com',

    // Meta CDNs
    'https://*.fbcdn.net',
    'https://*.cdninstagram.com',

    // Solo desarrollo/local
    'https://nomadests2026-production.up.railway.app',
    // Solo pruebas
    
  ],

  fontSrc: [
    "'self'",
    'data:'
  ],

  connectSrc: [
    "'self'",

    // Agregalos solo si ves bloqueos reales en embeds/API
    'https://www.youtube.com',
    'https://www.instagram.com',
    'https://www.facebook.com'
  ],

  mediaSrc: [
    "'self'",
    'blob:',
    'https://res.cloudinary.com'
  ],

  objectSrc: ["'none'"],

  baseUri: ["'self'"],

  // Evita que otros sitios embezan tu app
  frameAncestors: ["'self'"],

  // Permite iframes que TU página carga
  frameSrc: [
    'https://www.youtube.com',
    'https://www.youtube-nocookie.com',
    'https://www.instagram.com',
    'https://www.facebook.com'
  ],

  // Opcional, pero útil para endurecer formularios
  formAction: ["'self'"],

  requireTrustedTypesFor: ["'script'"],
  trustedTypes: ["default"]

}

export const helmetDevConfig: HelmetOptions = {
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      ...commonCspDirectives,

      imgSrc: [
        ...commonCspDirectives.imgSrc,
        'http://localhost:5173',
        'http://localhost:4000',
        'https://c0.klipartz.com/pngpicture/813/118/gratis-png-icono-de-silueta-plantilla-de-persona-en-blanco.png',
      ],

      connectSrc: [
        ...commonCspDirectives.connectSrc,
        'http://localhost:5173',
        'ws://localhost:5173'
      ]
    },

    // Muy útil para testear sin romper todo de entrada
    reportOnly: true
  },

  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}

export const helmetProdConfig: HelmetOptions = {
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      ...commonCspDirectives
    }
  },
    strictTransportSecurity: {
    maxAge: 31536000,
    includeSubDomains: true,
   // preload: true
  },
}


export const helmetMainConfig = envConfig.Status === 'production' ? helmetProdConfig : helmetDevConfig