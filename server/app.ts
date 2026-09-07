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
//import { domainRedirect } from './Shared/Utils/domainRedirect.js'

//eslint-disable-next-line
const dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
app.set('trust proxy', 1)
// app.use(domainRedirect(
//   envConfig.CanonicalUrl,
//   envConfig.AlternateUrl
// ))
if (envConfig.Status === 'development') {
  app.use(morgan('dev'))
}
app.use(cors(corsConfig))
app.use(helmet(helmetMainConfig))
app.use(cookieParser())
app.use(sessionMiddleware)
app.use(express.json()) // json parser might be needed for csrf if token in body (though here cookie)

// CSRF Protection
app.use(csrfProtection)
app.use(setCsrfToken)

app.use(eh.jsonFormat)
app.use(mainRouter)

if (envConfig.Status !== 'development' && envConfig.Status !== 'test') {
 const indexPath = path.join(path.resolve(), 'dist', 'index.html')
    app.use(express.static(path.join(path.resolve(), 'dist')));
    app.get('/', (req: Request, res: Response) => {
        res.sendFile(indexPath);
    });
app.get(/^(?!\/api).*/, (req: Request, res: Response) => {
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
