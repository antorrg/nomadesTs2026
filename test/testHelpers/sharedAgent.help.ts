import request from 'supertest'
import app from '../../server/app.js'

// Usar .agent(app) para persistencia de cookies entre peticiones
export const agent = request.agent(app)

let csrfToken: string = ''

export const setCsrfToken = (token: string) => {
    csrfToken = token
}

export const getCsrfToken = () => {
    return csrfToken
}
