import { type SuperTest, type Test } from 'supertest'
import { initialUser } from '../../server/Features/user/seed.js'
import envConfig from '../../server/Configs/envConfig.js'

export const loginAdmin = async (agent: any) => {
    // 1. Seed the admin user if not exists
    await initialUser()

    // 2. Get CSRF token - Hit a real public route
    const firstReq = await agent.get('/api/v1/product/public').send()
    const cookies = firstReq.headers['set-cookie']
    if (!cookies) {
        console.warn('No cookies received from /api/v1/product/public')
    }
    const xsrfCookie = (cookies || []).find((c: string) => c.startsWith('XSRF-TOKEN'))
    const csrfToken = xsrfCookie ? xsrfCookie.split('=')[1].split(';')[0] : ''

    if (!csrfToken) {
        console.warn('CSRF Token not found in cookies')
    }

    // 3. Login
    const loginRes = await agent.post('/api/v1/auth/login')
        .set('x-xsrf-token', csrfToken)
        .send({
            email: envConfig.RootEmail,
            password: envConfig.RootPass
        })

    if (loginRes.status !== 200) {
        console.error('Login failed with status:', loginRes.status)
        console.error('Login error body:', loginRes.body)
        throw new Error(`Login failed with status ${loginRes.status}`)
    }

    return csrfToken
}
