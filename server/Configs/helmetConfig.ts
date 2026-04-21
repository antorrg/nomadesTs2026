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
    'https://projectproduct-production.up.railway.app',
    'http://localhost:4000'
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
  formAction: ["'self'"]
}

export const helmetDevConfig: HelmetOptions = {
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      ...commonCspDirectives,

      imgSrc: [
        ...commonCspDirectives.imgSrc,
        'http://localhost:5173',
        'http://localhost:4000'
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
  }
}


export const helmetMainConfig = envConfig.Status === 'production' ? helmetProdConfig : helmetDevConfig