import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

const ENV_FILE = {
  production: '.env'
} as const

type Environment = 'production' | 'development' | 'test'

const NODE_ENV: Environment =
(process.env.NODE_ENV as Environment) ?? 'production'

let source: Record<string, string | undefined> = {}

if(NODE_ENV === 'production'){
  dotenv.config({ path: ENV_FILE.production })
  source = process.env
}else{
  const raw = fs.readFileSync(
    path.resolve('config.json'),
    'utf-8'
  )
  const parsed = JSON.parse(raw)
  if (!parsed[NODE_ENV]) {
    throw new Error(`Missing config for environment: ${NODE_ENV}`)
  }

  source = parsed[NODE_ENV]
}
const getNumberEnv = (key: string, defaultValue: number): number => {
  const parsed = Number(source[key])
  return isNaN(parsed) ? defaultValue : parsed
}

const getStringEnv = (key: string, defaultValue:string =''): string => {
  const value = source[key]
  return value ?? defaultValue
}


const envConfig = {
  Port: getNumberEnv('PORT', 3000),
  Status: NODE_ENV,
  UserImg: getStringEnv('USER_PICTURE'),
  BasePicture: getStringEnv('BASE_PICTURE'),
  DatabaseUrl: getStringEnv('DATABASE_URL'),
  optionRender: NODE_ENV==='production'? true : false,
  SessionSecret: getStringEnv('SESSION_SECRET'),
  RootEmail:getStringEnv('ROOT_EMAIL'),
  RootPass : getStringEnv('ROOT_PASS'),
  CloudName: getStringEnv("CLOUD_NAME"),
  CloudApiKey : getStringEnv("CLOUD_API_KEY"),
  CloudApiSecret : getStringEnv("CLOUD_API_SECRET"),
  GmailUser: getStringEnv("GMAIL_USER"),
  GmailPass: getStringEnv("GMAIL_APP_PASS"),
  MetaAppId: getStringEnv("META_APP_ID"),
  MetaAppSecret: getStringEnv("META_APP_SECRET"),
  BaseUrl: getStringEnv("VITE_BASE_URL"),
  TestImagesUploadDir: getStringEnv('IMAGES_DIR'),
  CanonicalUrl: getStringEnv('CANONICAL_URL'),
  AlternateUrl: getStringEnv('ALTERNATE_URL'),
}

export default envConfig
