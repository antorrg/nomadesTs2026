import express from 'express'
import request from 'supertest'
import { describe, it, expect } from 'vitest'
import { domainRedirect } from './domainRedirect'

describe('domainRedirect. Middleware para redireccion de dominio', () => {
  const app = express()

  app.use(
    domainRedirect(
      'nomadescabanas.com',
      'nomadescabañas.com'
    )
  )

  app.get('/test', (_req, res) => {
    res.status(200).json({ ok: true })
  })

  it('redirige el dominio alternativo al canónico', async () => {
    const response = await request(app)
      .get('/test')
      .set('Host', 'nomadescabañas.com')

    expect(response.status).toBe(301)
    expect(response.headers.location)
      .toBe('https://nomadescabanas.com/test')
  })

  it('redirige también "www" del dominio alternativo', async () => {
    const response = await request(app)
      .get('/test')
      .set('Host', 'www.nomadescabañas.com')

    expect(response.status).toBe(301)
    expect(response.headers.location)
      .toBe('https://nomadescabanas.com/test')
  })

  it('no redirige el dominio canónico', async () => {
    const response = await request(app)
      .get('/test')
      .set('Host', 'nomadescabanas.com')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ ok: true })
  })
})