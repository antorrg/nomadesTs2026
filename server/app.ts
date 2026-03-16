import express, { type Request, type Response } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import cookieParser from 'cookie-parser'
import { sessionMiddleware } from './Shared/Auth/Session.js'
import { csrfProtection, setCsrfToken } from './Shared/Auth/authMiddlewares.js'
import eh from './Configs/errorHandlers.js'
import mainRouter from './routes.js'
import envConfig from './Configs/envConfig.js'
import { corsConfig } from './Configs/corsConfig.js'


const dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
if (envConfig.Status === 'development') {
  app.use(morgan('dev'))
}
app.use(cors(corsConfig))
app.use(cookieParser())
app.use(sessionMiddleware)
app.use(express.json()) // json parser might be needed for csrf if token in body (though here cookie)

// CSRF Protection
app.use(csrfProtection)
app.use(setCsrfToken)

if (envConfig.Status === 'production') {
  app.use(express.static(path.join(dirname, 'dist')))
  app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(dirname, 'dist', 'index.html'))
  })
}
if(envConfig.Status === 'development') {
   app.use( '/serverAssets/uploads',express.static(path.join(path.resolve(), 'serverAssets/uploads')))
}

app.use(eh.jsonFormat)

app.use(mainRouter)
app.use(eh.notFoundRoute)
app.use(eh.errorEndWare)

export default app
