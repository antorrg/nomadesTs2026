import { type HelmetOptions, } from 'helmet'
import envConfig from './envConfig.js'


const commonCspDirectives = {
  defaultSrc: ["'self'"],

  scriptSrc: [
    "'self'",
    "'unsafe-inline'",

    // YouTube
    'https://www.youtube.com',

    // Meta embeds / SDKs
    'https://www.instagram.com',
    'https://*.instagram.com',
    'https://www.facebook.com',
    'https://*.facebook.com',
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

    // Meta CDNs & Facebook
    'https://*.fbcdn.net',
    'https://*.fna.fbcdn.net',
    'https://*.cdninstagram.com',
    'https://www.facebook.com',
    'https://*.facebook.com',

    // Servidor producción
    //`${envConfig.BaseUrl}`,
    'https://nomadests2026-production.up.railway.app/'
  ],

  fontSrc: [
    "'self'",
    'data:'
  ],

  connectSrc: [
    "'self'",
    'https://www.youtube.com',
    'https://www.instagram.com',
    'https://*.instagram.com',
    'https://www.facebook.com',
    'https://*.facebook.com',
    'https://connect.facebook.net',
    'https://*.fbcdn.net'
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
    'https://*.instagram.com',
    'https://www.facebook.com',
    'https://*.facebook.com',
    'https://web.facebook.com',
    'https://m.facebook.com',
    'https://fb.watch'
  ],

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
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }
}

export const helmetProdConfig: HelmetOptions = {
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      ...commonCspDirectives
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  strictTransportSecurity: {
    maxAge: 31536000,
    includeSubDomains: true
  }
}


export const helmetMainConfig = envConfig.Status === 'production' ? helmetProdConfig : helmetDevConfig
