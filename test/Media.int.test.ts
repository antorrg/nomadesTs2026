import { describe, it, expect } from 'vitest'
import { agent, getCsrfToken } from './testHelpers/sharedAgent.help.js'

export const mediaTests = () => {
    describe('INTEGRATION TEST - "/api/v1/media"', () => {
        let mediaId: number

        it('POST / - should create a media entry', async () => {
            const data = {
                title: 'Youtube Video',
                type: 'video',
                text: 'Check this out!',
                url: 'https://youtube.com/watch?v=123',
                enabled: true
            }
            const response = await agent
                .post('/api/v1/media')
                .set('x-xsrf-token', getCsrfToken())
                .send(data)

            expect(response.status).toBe(201)
            mediaId = response.body.results.id
        })

        it('GET / - should retrieve all media entries', async () => {
            const response = await agent.get('/api/v1/media')
            expect(response.status).toBe(200)
            expect(Array.isArray(response.body.results)).toBe(true)
        })

        it('PUT /:id - should update media entry', async () => {
            const data = {
                title: 'Updated Youtube Video',
                enabled: false
            }
            const response = await agent
                .put(`/api/v1/media/${mediaId}`)
                .set('x-xsrf-token', getCsrfToken())
                .send(data)

            expect(response.status).toBe(200)
            expect(response.body.results.title).toBe('Updated Youtube Video')
        })

        it('DELETE /:id - should delete media entry', async () => {
            const response = await agent
                .delete(`/api/v1/media/${mediaId}`)
                .set('x-xsrf-token', getCsrfToken())

            expect(response.status).toBe(200)
        })
    })
}
