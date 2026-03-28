import { describe, it, expect, beforeAll } from 'vitest'
import { agent, getCsrfToken } from './testHelpers/sharedAgent.help.js'
import fs from 'fs/promises'
import path from 'path'
import envConfig from '../server/Configs/envConfig.js'

export const landingTests = () => {
    describe('INTEGRATION TEST - "/api/v1/landing"', () => {
        let landingId: number
        const uploadDir = envConfig.TestImagesUploadDir

        const fileExists = async (filename: string) => {
            try {
                await fs.access(path.join(uploadDir, filename))
                return true
            } catch {
                return false
            }
        }

        beforeAll(async () => {
            await fs.mkdir(uploadDir, { recursive: true })
            const files = ['landing_main.png', 'landing_updated.png', 'landing_delete.png']
            for (const file of files) {
                await fs.writeFile(path.join(uploadDir, file), 'fake image content')
            }
        })

        it('POST / - should create a landing entry and consume image', async () => {
            const data = {
                title: 'Welcome to Nomades',
                picture: 'landing_main.png',
                info_header: 'Digital Nomads',
                description: 'Explore the world while working.',
                useImg: true
            }
            const response = await agent
                .post('/api/v1/landing')
                .set('x-xsrf-token', getCsrfToken())
                .send(data)

            expect(response.status).toBe(201)
            landingId = response.body.results.id
            expect(await fileExists('landing_main.png')).toBe(false)
        }, 10000)

        it('GET / - should retrieve all landing entries', async () => {
            const response = await agent.get('/api/v1/landing')
            expect(response.status).toBe(200)
            expect(Array.isArray(response.body.results)).toBe(true)
        })

        it('PUT /:id - should update landing entry and handle old image', async () => {
            const data = {
                title: 'Updated Landing',
                picture: 'landing_updated.png',
                useImg: true,
                saver: false
            }
            const response = await agent
                .put(`/api/v1/landing/${landingId}`)
                .set('x-xsrf-token', getCsrfToken())
                .send(data)

            expect(response.status).toBe(200)
            expect(await fileExists('landing_updated.png')).toBe(false)
        }, 10000)

        it('DELETE /:id - should delete landing entry and its image', async () => {
            // Preparamos un registro nuevo para borrar
            const data = {
                title: 'Delete Me',
                picture: 'landing_delete.png',
                info_header: 'H',
                description: 'D',
                useImg: false
            }
            const createRes = await agent
                .post('/api/v1/landing')
                .set('x-xsrf-token', getCsrfToken())
                .send(data)

            const idToDelete = createRes.body.results.id
            expect(await fileExists('landing_delete.png')).toBe(true)

            const response = await agent
                .delete(`/api/v1/landing/${idToDelete}`)
                .set('x-xsrf-token', getCsrfToken())

            expect(response.status).toBe(200)
            expect(await fileExists('landing_delete.png')).toBe(false)
        }, 10000)
    })
}
