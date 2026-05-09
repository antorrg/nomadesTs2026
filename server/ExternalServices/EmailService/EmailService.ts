import nodemailer from 'nodemailer'
import fs from 'fs/promises'
import path from 'path'
import envConfig from '../../Configs/envConfig.js'

const TEMPLATE_DIR = path.join(process.cwd(), 'server/ExternalServices/EmailService/emails')
//console.log('sot dir',TEMPLATE_DIR)
// Tipo para valores de variables en templates
export type TemplateVariables = Record<string, string | number | boolean | Date>

// ========== INTERFACES ==========

export interface IEmailTransport {
  send(options: EmailSendOptions): Promise<void>
}

export interface EmailSendOptions {
  to: string
  subject: string
  html?: string
  text?: string
  from?: string
  replyTo?: string
}

// ========== NODEMAILER TRANSPORT (Producción) ==========

export class NodemailerTransport implements IEmailTransport {
  #transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    service: 'gmail',
    auth: {
      user: envConfig.GmailUser,
      pass: envConfig.GmailPass
    },
    tls: {
      rejectUnauthorized: false
    }
  })

  async send(options: EmailSendOptions): Promise<void> {
    await this.#transporter.sendMail({
      from: options.from ?? `"Nomades" <${envConfig.GmailUser}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo
    })
  }
}

// ========== MOCK TRANSPORT (Testing) ==========

export class MockEmailTransport implements IEmailTransport {
  public sent: EmailSendOptions[] = []

  async send(options: EmailSendOptions): Promise<void> {
    this.sent.push(options)
  }

  reset(): void {
    this.sent = []
  }
}

// ========== EMAIL SERVICE (Lógica de negocio) ==========

export class EmailService {
  constructor(
    private readonly transport: IEmailTransport
  ) { }

  async sendTemplateEmail(
    templateName: string,
    variables: TemplateVariables,
    options: {
      to: string
      subject: string
      replyTo?: string
    }
  ): Promise<void> {
    const html = await this.#getEmailTemplate(templateName, variables)

    await this.transport.send({
      to: options.to,
      subject: options.subject,
      html,
      replyTo: options.replyTo
    })
  }

  async sendRawEmail(options: EmailSendOptions): Promise<void> {
    await this.transport.send(options)
  }
  async #getEmailTemplate(
    templateName: string, 
    variables: TemplateVariables
  ): Promise<string> {
    const filePath = path.join(TEMPLATE_DIR, `${templateName}.html`)
  
    let html = await fs.readFile(filePath, 'utf-8')
  
    // Reemplazo simple de {{variable}} por su valor
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g') // soporta {{ variable }}
      html = html.replace(regex, String(value))
    }
  
    return html
  }
}

// ========== INSTANCIA SINGLETON (Producción) ==========

export const emailService = new EmailService(
  new NodemailerTransport()
)