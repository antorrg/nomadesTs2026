import express from 'express'
import { MailController } from './MailController.js'
import { Validator } from 'req-valid-express'
import { RateLimiter } from '../../Shared/Middlewares/RateLimiter.js'

const mailRouter = express.Router()

const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

mailRouter.post(
  '/contact',
  RateLimiter.emailRateLimiter,
  Validator.validateBody({
    email: {type: 'string'},
    issue: {type:'string'},
    message: {type:'string'}
  }),
  Validator.validateRegex(emailRegex, 'email', 'Enter a valid email address'),
  MailController.sendContactEmail
)

export default mailRouter
