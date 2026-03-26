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

const getStringEnv = (key: string, defaultValue = ''): string => {
  return source[key] ?? defaultValue
}


const envConfig = {
  Port: getNumberEnv('PORT', 3000),
  Status: NODE_ENV,
  UserImg: getStringEnv('USER_PICTURE', ''),
  BasePicture: getStringEnv('BASE_PICTURE', ''),
  DatabaseUrl: getStringEnv('DATABASE_URL', 'Undefined'),
  Secret: getStringEnv('JWT_SECRET',''),
  ExpiresIn: getStringEnv('JWT_EXPIRES_IN', '1'),
  TestImagesUploadDir: getStringEnv('IMAGES_DIR', 'noData'),
  SessionSecret: getStringEnv('SESSION_SECRET', 'test-secret'),
  RootEmail:getStringEnv('ROOT_EMAIL', ''),
  RootPass : getStringEnv('ROOT_PASS',''),
  CloudName: getStringEnv("CLOUD_NAME", ''),
  CloudApiKey : getStringEnv("CLOUD_API_KEY", ''),
  CloudApiSecret : getStringEnv("CLOUD_API_SECRET",''),
  GmailUser: getStringEnv("GMAIL_USER",''),
  GmailPass: getStringEnv("GMAIL_APP_PASS",''),
}

export default envConfig
