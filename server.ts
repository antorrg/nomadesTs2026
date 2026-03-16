// ? o    o                            8
// ? 8b   8                            8
// ? 8`b  8 .oPYo. ooYoYo. .oPYo. .oPYo8 .oPYo. .oPYo.
// ? 8 `b 8 8    8 8' 8  8 .oooo8 8    8 8oooo8 Yb..
// ? 8  `b8 8    8 8  8  8 8    8 8    8 8.       'Yb.
// ? 8   `8 `YooP' 8  8  8 `YooP8 `YooP' `Yooo' `YooP'
// ? ..:::..:.....:..:..:..:.....::.....::.....::.....:
// ? ::::::::::::::::::::::::::::::::::::::::::::::::::
// todo :::::: App refactorizada el 12-07-2025:::::::::
// todo ::: Transcripta en Typescript el 01-02-2026 :::

import app from './server/app.js'
import { startUp } from './server/Configs/database.js'
import envConfig from './server/Configs/envConfig.js'
import { initialUser } from './server/Features/user/seed.js'
import  logger  from './server/Configs/logger.js'
import { configureCloudinary } from './server/ExternalServices/cloudinary.js'

const initialMessage = `Server is listening on port ${envConfig.Port}\nServer in ${envConfig.Status}\n 🚀​ Everything is allright!!`

async function serverBootstrap () {
  try {
    await startUp()
    app.listen(envConfig.Port, () => {
    logger.info(initialMessage)
    console.log(initialMessage)
      })
    if(envConfig.Status === 'production'){
      await configureCloudinary()
    }
    await initialUser()
  } catch (error) {
    logger.error(error)
    console.error('Error initializing app: ',error)
    process.exit(1)
  }
}

serverBootstrap()
