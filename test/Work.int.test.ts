import { describe, it, expect, beforeAll } from 'vitest'
import { agent, getCsrfToken } from './testHelpers/sharedAgent.help.js'
import fs from 'fs/promises'
import path from 'path'

export const workTests = () => {
    describe('INTEGRATION TEST - "/api/v1/work"', () => {
        let workId: number
        const uploadDir = 'serverAssets/uploads'

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
            const files = ['work_main.png', 'work_updated.png', 'work_delete.png']
            for (const file of files) {
                await fs.writeFile(path.join(uploadDir, file), 'fake image content')
            }
        })

        it('POST / - should create a work entry and consume image', async () => {
            const data = {
                title: 'Project Alpha',
                picture: 'work_main.png',
                text: 'A great project.',
                useImg: true
            }
            const response = await agent
                .post('/api/v1/work')
                .set('x-xsrf-token', getCsrfToken())
                .send(data)

            expect(response.status).toBe(201)
            workId = response.body.results.id
            expect(await fileExists('work_main.png')).toBe(false)
        }, 10000)

        it('GET / - should retrieve all work entries', async () => {
            const response = await agent.get('/api/v1/work')
            expect(response.status).toBe(200)
            expect(Array.isArray(response.body.results)).toBe(true)
        })

        it('PUT /:id - should update work entry and handle old image', async () => {
            const data = {
                title: 'Updated Project Alpha',
                picture: 'work_updated.png',
                useImg: true,
                saver: false
            }
            const response = await agent
                .put(`/api/v1/work/${workId}`)
                .set('x-xsrf-token', getCsrfToken())
                .send(data)

            expect(response.status).toBe(200)
            expect(await fileExists('work_updated.png')).toBe(false)
        }, 10000)

        it('DELETE /:id - should delete work entry and its image', async () => {
            const data = {
                title: 'Delete Work',
                picture: 'work_delete.png',
                text: 'D',
                useImg: false
            }
            const createRes = await agent
                .post('/api/v1/work')
                .set('x-xsrf-token', getCsrfToken())
                .send(data)

            const idToDelete = createRes.body.results.id
            expect(await fileExists('work_delete.png')).toBe(true)

            const response = await agent
                .delete(`/api/v1/work/${idToDelete}`)
                .set('x-xsrf-token', getCsrfToken())

            expect(response.status).toBe(200)
            expect(await fileExists('work_delete.png')).toBe(false)
        }, 10000)
    })
}
