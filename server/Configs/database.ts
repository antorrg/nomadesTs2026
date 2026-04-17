import { Sequelize } from 'sequelize'
import envConfig from './envConfig.js'
import models from '../../Models/index.js'
import logger from './logger.js'


const sequelize = new Sequelize(envConfig.DatabaseUrl, {
  logging: false,
  native: false
})

Object.values(models).forEach((modelDef) => {
  modelDef(sequelize)
})

const { 
  User,
  About,
  Log,
  Product,
  Item,
  Landing,
  Media,
  Image,
  Work,
} = sequelize.models
// Relations here below:
Product.hasMany(Item, { foreignKey: 'ProductId', as: 'Items', onDelete: 'CASCADE', onUpdate: 'CASCADE'})

Item.belongsTo(Product, { foreignKey: 'ProductId', as: 'Product' })

// ------------------------
//    Initilization database:
// -------------------------
function getNameDb(dbUri:string):string {
 return dbUri.split('/').slice(-1).join()
}

async function startUp (syncDb: boolean = false, rewrite: boolean = false) {
  try {
    await sequelize.authenticate()
    const successMessage =`🟢​ Database postgreSQL "${getNameDb(envConfig.DatabaseUrl)}" initialized successfully!!`
    console.log(successMessage)
    if (envConfig.Status !== 'production' && syncDb) {
      try {
        await sequelize.sync({ force: rewrite })
        let message = `🧪 Synced database ${getNameDb(envConfig.DatabaseUrl)}: "force ${rewrite}"`
        logger.info(message)
      } catch (error) {
        logger.error(error)
        //console.error(`❗Error syncing database ${getNameDb(envConfig.DatabaseUrl)}`, error)
      }
    }
    logger.info(successMessage)
  } catch (error) {
    //console.error('❌ Error conecting database!', error)
    logger.error(error)
  }
}
const closeDatabase = async () => {
  await sequelize.close()
  logger.info('🛑 Database disconnect')
}

export { 
  startUp, 
  closeDatabase, 
  sequelize, 
  User,
  About,
  Log,
  Product,
  Item,
  Landing,
  Media,
  Image,
  Work,
}
