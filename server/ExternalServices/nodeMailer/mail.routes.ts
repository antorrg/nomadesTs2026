import express from 'express'
import { MailController } from './MailController.js'
import { Validator } from 'req-valid-express'

const mailRouter = express.Router()

const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

mailRouter.post(
  '/contact',
  Validator.validateBody({
    email: 'string',
    issue: 'string',
    message: 'string'
  }),
  Validator.validateRegex(emailRegex, 'email', 'Enter a valid email address'),
  MailController.sendContactEmail
)

export default mailRouter
