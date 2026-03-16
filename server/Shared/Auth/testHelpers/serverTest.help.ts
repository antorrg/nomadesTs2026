import express from 'express'
import { sessionMiddleware } from '../Session.js'
import { csrfProtection, setCsrfToken, isAuthenticated, authorize, UserRole, Auth } from '../authMiddlewares.js'
import cookieParser from 'cookie-parser'

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(sessionMiddleware)
app.use(csrfProtection)
app.use(setCsrfToken)

app.post('/login', (req, res) => {
    const { user } = req.body
    Auth.login(req, user)
    res.status(200).json({ success: true, message: 'Logged in' })
})

app.post('/logout', async (req, res) => {
    await Auth.logout(req)
    res.status(200).json({ success: true, message: 'Logged out' })
})

app.get('/csrf', (req, res) => {
    res.status(200).json({ success: true, message: 'CSRF token set' })
})

app.get('/protected', isAuthenticated, (req, res) => {
    res.status(200).json({ success: true, message: 'Passed middleware', user: req.session.user })
})

app.get('/admin', authorize(UserRole.ADMIN), (req, res) => {
    res.status(200).json({ success: true, message: 'Passed middleware' })
})

export default app
