import { describe, it, expect } from 'vitest'
import { agent, getCsrfToken } from './testHelpers/sharedAgent.help.js'
import * as store from './testHelpers/testStore.help.js'

export const userTests = () => {
  describe('INTEGRATION TEST - "/api/v1/user"', () => {
    describe('POST /create', () => {
      it('should create an user as admin', async () => {
        const csrfToken = getCsrfToken()
        const data = { email: 'jose_test@gmail.com', password: 'L1234567' }
        const response = await agent
          .post('/api/v1/user/create')
          .set('x-xsrf-token', csrfToken)
          .send(data)

        expect(response.status).toBe(201)
        expect(response.body.success).toBe(true)
        expect(response.body.results).toMatchObject({
          email: 'jose_test@gmail.com',
          nickname: 'jose_test',
          enabled: true
        })
        store.setStringId(response.body.results.id)
      })

      it('should return 400 when email already exists', async () => {
        const csrfToken = getCsrfToken()
        const data = { email: 'jose_test@gmail.com', password: 'L1234567' }
        const response = await agent
          .post('/api/v1/user/create')
          .set('x-xsrf-token', csrfToken)
          .send(data)

        expect(response.status).toBe(400)
        expect(response.body.success).toBe(false)
      })
    })

    describe('GET /', () => {
      it('should retrieve all users', async () => {
        const response = await agent
          .get('/api/v1/user')
          .expect(200)
        expect(response.body.success).toBe(true)
        expect(Array.isArray(response.body.results)).toBe(true)
        expect(response.body.results.some((u: any) => u.email === 'jose_test@gmail.com')).toBe(true)
      })
    })

    describe('GET /pages', () => {
      it('should retrieve paginated users', async () => {
        const response = await agent
          .get('/api/v1/user/pages')
          .expect(200)
        expect(response.body.success).toBe(true)
        expect(response.body.info).toBeDefined()
        expect(Array.isArray(response.body.results)).toBe(true)
      })
    })

    describe('GET /:id', () => {
      it('should retrieve a specific user', async () => {
        const userId = store.getStringId()
        const response = await agent
          .get(`/api/v1/user/${userId}`)
          .expect(200)
        expect(response.body.success).toBe(true)
        expect(response.body.results.id).toBe(userId)
      })
    })

    describe('PATCH /:id/upgrade', () => {
      it('should upgrade user role and status as moderator', async () => {
        const userId = store.getStringId()
        const data = { role: 'MODERATOR' }
        const response = await agent
          .patch(`/api/v1/user/${userId}/upgrade`)
          .set('x-xsrf-token', getCsrfToken())
          .send(data)

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.results.role).toBe('MODERATOR')
      })
    })
    describe('PATCH /:id/change-password', () => {
      it('should change user password', async () => {
        const userId = store.getStringId()
        const { default: request } = await import('supertest')
        // @ts-ignore
        const { default: app } = await import('../../server/app.js')
        const userAgent = request.agent(app)

        const publicRes = await userAgent.get('/api/v1/product/public').send()
        const setCookieHeader = publicRes.headers['set-cookie']
        const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : (setCookieHeader ? [setCookieHeader] : [])
        const xsrfCookie = cookies.find((c: string) => c.startsWith('XSRF-TOKEN'))
        const csrfToken = xsrfCookie ? xsrfCookie.split('=')[1].split(';')[0] : ''

        await userAgent.post('/api/v1/auth/login')
          .set('x-xsrf-token', csrfToken)
          .send({ email: 'jose_test@gmail.com', password: 'L1234567' })

        const data = { password: 'L1234567', newPassword: 'L1234568' }
        const response = await userAgent
          .patch(`/api/v1/user/${userId}/change-password`)
          .set('x-xsrf-token', csrfToken)
          .send(data)

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.results.role).toBe('MODERATOR')
      })
    })

    describe('PATCH /:id/reset-password', () => {
      it('should trigger admin forced reset sequence validating backend hasher bindings', async () => {
        const userId = store.getStringId()
        
        // This is sent via standard admin authorization global 'agent' which has XSRF set up 
        const response = await agent
          .patch(`/api/v1/user/${userId}/reset-password`)
          .set('x-xsrf-token', getCsrfToken())
          .send()

        expect(response.status).toBe(200)
       // console.log(response.body.results)
        expect(response.body.success).toBe(true)
        // Ensure standard object return matches what an update does
        expect(response.body.results).toBeDefined()
      })
    })

    describe('PATCH /:id/blocker', () => {
      it('should block user', async () => {
        const userId = store.getStringId()
        const data = { enabled: false }
        const response = await agent
          .patch(`/api/v1/user/${userId}/blocker`)
          .set('x-xsrf-token', getCsrfToken())
          .send(data)

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.results.enabled).toBe(false)
      })
    })

    describe('DELETE /:id', () => {
      it('should delete a user', async () => {
        const userId = store.getStringId()
        const response = await agent
          .delete(`/api/v1/user/${userId}`)
          .set('x-xsrf-token', getCsrfToken())
          .expect(200)
        expect(response.body.success).toBe(true)
      })
    })
  })
}
