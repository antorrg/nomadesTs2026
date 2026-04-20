import express, { type Request, type Response } from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
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
import { helmetMainConfig } from './Configs/helmetConfig.js'


const dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
if (envConfig.Status === 'development') {
  app.use(morgan('dev'))
}
app.use(cors(corsConfig))
app.use(helmet(helmetMainConfig))
app.set('trust proxy', 1)
app.use(cookieParser())
app.use(sessionMiddleware)
app.use(express.json()) // json parser might be needed for csrf if token in body (though here cookie)

// CSRF Protection
app.use(csrfProtection)
app.use(setCsrfToken)

app.use(eh.jsonFormat)

app.use(mainRouter)

if (envConfig.Status === 'production') {
 const indexPath = path.join(path.resolve(), 'dist', 'index.html')
    app.use(express.static(path.join(path.resolve(), 'dist')));
    app.get('/', (req, res) => {
        res.sendFile(indexPath);
    });
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(indexPath)
})
}
if (envConfig.Status === 'development' || envConfig.Status === 'test') {
   const uploadDir = envConfig.TestImagesUploadDir || 'serverAssets/uploads';
   app.use(`/${uploadDir}`, express.static(path.join(path.resolve(), uploadDir)))
}

app.use(eh.notFoundRoute)
app.use(eh.errorEndWare)

export default app
