import { describe, beforeAll, afterAll } from 'vitest'
import { startUp, closeDatabase } from '../server/Configs/database.js'
import { loginAdmin } from './testHelpers/validationHelper.help.js'
import { agent, setCsrfToken } from './testHelpers/sharedAgent.help.js'

// Import individual test suites
import { userTests } from './User.int.test.js'
import { productTests } from './Product.int.test.js'
import { imageTests } from './Image.int.test.js'
import { landingTests } from './Landing.int.test.js'
import { workTests } from './Work.int.test.js'
import { mediaTests } from './Media.int.test.js'


describe('GLOBAL E2E SETUP', () => {
    beforeAll(async () => {
        // 1. Initialize Database for testing
        await startUp(true, true)

        // 2. Perform global login and capture CSRF
        const token = await loginAdmin(agent)
        setCsrfToken(token)
    })

    afterAll(async () => {
        await closeDatabase()
    })

    // Run suites
    userTests()
    productTests()
    imageTests()
    landingTests()
    workTests()
    mediaTests()
})