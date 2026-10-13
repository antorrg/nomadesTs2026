const dotenv = require('dotenv')

const environment = process.env.NODE_ENV ?? 'development'

dotenv.config({
  path: `.env.${environment}`
})

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres'
  },

  test: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres'
  },

  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
        dialectOptions: {
        ssl: {
          require: true
        }
      }
  }
}