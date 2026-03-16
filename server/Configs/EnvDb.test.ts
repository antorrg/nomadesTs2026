import {describe, it, expect, beforeAll, afterAll } from 'vitest'
import envConfig from './envConfig.js'
import {startUp, closeDatabase,  User, About, Log, Product, Item, Landing, Media, Image, Work, } from './database.js'

describe('Environment variables', () => {
  it('should return the correct environment status and database variable', () => {
    const formatEnvInfo = `Servidor corriendo en: ${envConfig.Status}\n` +
                   `Base de datos de testing: ${envConfig.DatabaseUrl}`
    expect(formatEnvInfo).toBe('Servidor corriendo en: test\n' +
        'Base de datos de testing: postgres://postgres:antonio@localhost:5432/testing')
  })
})
describe('Database existence', () => {
  beforeAll(async()=>{
    await startUp(true, true)
  })
  afterAll(async()=>{
    await closeDatabase()
  })
   it('should query tables and return an empty array', async() => { 
      const models = [  User, About, Log, Product, Item, Landing, Media, Image, Work, ];
   for (const model of models) {
     const records = await model.findAll();
     expect(Array.isArray(records)).toBe(true);
     expect(records.length).toBe(0);
   }
   })
 })
