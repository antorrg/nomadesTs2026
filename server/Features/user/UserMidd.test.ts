import {describe, it, expect } from 'vitest'
import session from 'supertest'
import testServer from './helperTest/userMiddServer.help'
const agent = session.agent(testServer)


describe('CreateUser middleware', () => {
    it('should provide data for user creation', async() => {
        const data = {email: 'emailexample@fake.com', password: 'D4458ggdr'}
        const test = await agent
        .post('/test/create')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(200)
     expect(test.body.message).toBe('Passed middleware')
     //console.log(test.body.data)
     expect(test.body.data).toEqual({
        email: 'emailexample@fake.com',
        password: expect.any(String),
        nickname:'emailexample',
        picture: expect.any(String),
        enabled: true
     })
    })
})
describe('ProfileGuard middleware', () => {
    it('should allow updating the profile if the user is its owner', async() => { 
        const data = {email: 'emailexample@fake.com', picture: 'pepe'}
        const id= '123'
        const test = await agent
            .put(`/test/profile/${id}`)
            .send(data)
            .expect('Content-Type', /json/)
            .expect(200)
        expect(test.body.message).toBe('Passed middleware')
    })
    it('should throw an error if there were no session.', async() => { 
        const data = {email: 'emailexample@fake.com', picture: 'pepe'}
        const id= '456'
        const test = await agent
            .put(`/test/nosession/${id}`)
            .send(data)
            .expect('Content-Type', /json/)
            .expect(401)
        expect(test.body.message).toBe('No autorizado')
    })
    it('should throw an error if the user is not the owner', async() => { 
        const data = {email: 'emailexample@fake.com', picture: 'pepe'}
        const id= '456'
        const test = await agent
            .put(`/test/profile/${id}`)
            .send(data)
            .expect('Content-Type', /json/)
            .expect(400)
        expect(test.body).toEqual({
            message: "Solo el propietario puede actualizar su perfil",
            results: null,
            success: false,
            })
    })
})
describe('ResetPassword middleware', () => {
    it('should generate a plain 12-characters password and a hashed password', async() => {
        const dataUser = {id: 'user123'}
        const bcryptRegex = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/
        const test = await agent
          .post('/test/resetPassword')
          .send(dataUser)
          .expect('Content-Type', /json/)
          .expect(200)
        expect(test.body.message).toBe('Passed middleware')
        expect(test.body.data.id).toBe('user123')
        expect(test.body.data.plainPassword.length).toBe(12)
        expect(test.body.data.hashedPassword).toMatch(bcryptRegex)
    })
})
