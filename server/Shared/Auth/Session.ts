// src/config/session.ts
import session from "express-session"
import SequelizeStoreInit from "connect-session-sequelize"
import { sequelize } from "../../Configs/database.js"
import envConfig from "../../Configs/envConfig.js"

const SequelizeStore = SequelizeStoreInit(session.Store)

const store = envConfig.Status === 'test'
  ? new session.MemoryStore()
  : new SequelizeStore({ db: sequelize })

export const sessionMiddleware = session({
  secret: envConfig.SessionSecret,
  store,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    secure: envConfig.Status === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 30 // 30m
  }
})
