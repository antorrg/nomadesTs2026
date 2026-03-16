import { type Request, type Response, type NextFunction } from 'express'
import envConfig from './envConfig.js'
import logger from './logger.js'

type Controller = (req: Request, res: Response, next: NextFunction) => Promise<any>

class CustomError extends Error {
  public log: boolean
  constructor(log: boolean = false) {
    super()
    this.log = log
    Object.setPrototypeOf(this, CustomError.prototype)
  }

  throwError(message: string, status: number): never {
    const error = new Error(message) as Error & { status?: number, contexts: string[] }
    error.status = Number(status) || 500
    error.contexts = []
    throw error
  }

  processError(err: unknown, contextMessage: string): never {
    let normalized: Error & { status?: number, contexts: string[] }

    if (err instanceof Error) {
      // ya es un Error
      normalized = err as Error & { status?: number, contexts: string[] }
      normalized.status = normalized.status ?? 500
      normalized.contexts = Array.isArray(normalized.contexts) ? normalized.contexts : []
    } else {
      // no es Error → lo convierto en un Error real para tener stack trace
      normalized = new Error(String(err)) as Error & { status?: number, contexts: string[] }
      normalized.name = 'UnknownError'
      normalized.status = 500
      normalized.contexts = []
    }

    // evitar duplicados de contexto
    const last = normalized.contexts[normalized.contexts.length - 1]
    if (!last || last !== contextMessage) normalized.contexts.push(contextMessage)

    throw normalized
  }
}

const errorHandler = new CustomError(true)

export const middError = (message: string, status: number): Error & { status?: number, contexts?: string[] } => {
  const error = new Error(message) as Error & { status?: number, contexts?: string[] }
  error.status = status
  error.contexts = ['Middleware error:']
  return error
}
export const throwError = errorHandler.throwError.bind(errorHandler)

export const processError = errorHandler.processError.bind(errorHandler)

export const errorEndWare = (err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500
  const message = err.message || 'Error interno del servidor'

  // 1. Aseguramos que contexts sea un array (esto soluciona el bug de la línea que no asignaba nada)
  const contexts = Array.isArray(err.contexts) ? err.contexts : ['Error no controlado']

  // 2. Log en consola para visibilidad inmediata
  console.error('Error Contexts:', contexts)
  console.error('error completo.', err)

  // 3. Enviamos al logger con el formato que el dbTransport espera (log.err.contexts)
  // Pasamos un objeto err explícito porque Pino no serializa propiedades personalizadas de los Error por defecto
  logger.error({
    err: {
      message: err.message,
      stack: err.stack,
      status,
      contexts,
      type: err.name || 'Error'
    }
  }, `${message}`)

  res.status(status).json({
    success: false,
    message,
    results: null // Alineado con la estructura de BaseController
  })
}

export const jsonFormat = (err: Error & { status?: number }, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
    res.status(400).json({ error: 'Formato JSON inválido' })
  } else {
    next()
  }
}

export const notFoundRoute = (req: Request, res: Response, next: NextFunction): void => {
  next(middError('Recurso no encontrado', 404))
}

export default {
  errorEndWare,
  throwError,
  processError,
  middError,
  jsonFormat,
  notFoundRoute
}
// import { Request, Response, NextFunction } from 'express'
// import envConfig from './envConfig.js'
// import logger from './logger.js'

// type Controller = (req: Request, res: Response, next: NextFunction) => Promise<any>

// class CustomError extends Error {
//   public log: boolean
//   constructor (log: boolean = false) {
//     super()
//     this.log = log
//     Object.setPrototypeOf(this, CustomError.prototype)
//   }

//   throwError (message: string, status: number, err: Error | null = null): never {
//     const error = new Error(message) as Error & { status?: number }
//     error.status = Number(status) || 500
//     if (this.log && (err != null)) {
//       console.error('Error: ', err)
//     }
//     throw error
//   }

//   processError (err: Error & { status?: number, [key: string]: any }, contextMessage: string): never {
//     const defaultStatus = 500
//     const status = err.status || defaultStatus

//     const message = err.message
//       ? `${contextMessage}: ${err.message}`
//       : contextMessage

//     // Creamos un nuevo error con la información combinada
//     const error = new Error(message) as Error & { status?: number, originalError?: Error }
//     error.status = status
//     error.originalError = err // Guardamos el error original para referencia

//     // Log en desarrollo si es necesario
//     if (this.log) {
//       console.error('Error procesado:', {
//         context: contextMessage,
//         originalMessage: err.message,
//         status,
//         originalError: err
//       })
//     }

//     throw error
//   }
// }
// const environment = envConfig.Status
// const errorHandler = new CustomError(environment === 'development' || environment === 'test')

// export const middError = (message: string, status: number): Error & { statusCode?: number } => {
//   const error = new Error(message) as Error & { status?: number }
//   error.status = status
//   return error
// }
// export const throwError = errorHandler.throwError.bind(errorHandler)

// export const processError = errorHandler.processError.bind(errorHandler)

// export const errorEndWare = (err: Error & { status?: number }, req: Request, res: Response, next: NextFunction) => {
//   const status = err.status || 500
//   const message = err.message || 'Internal server error'
//   Array.isArray(err.contexts) ? err.contexts : ['Unhandled error']
//   logger.error({ err }, `${message}`)
//   res.status(status).json({
//     success: false,
//     message,
//     data: null
//   })
// }

// export const jsonFormat = (err: Error & { status?: number }, req: Request, res: Response, next: NextFunction): void => {
//   if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
//     res.status(400).json({ error: 'Invalid JSON format' })
//   } else {
//     next()
//   }
// }

// export const notFoundRoute = (req: Request, res: Response, next: NextFunction): void => {
//   return next(middError('Not Found', 404))
// }

// export default {
//   errorEndWare,
//   throwError,
//   processError,
//   middError,
//   jsonFormat,
//   notFoundRoute
// }
