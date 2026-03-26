import nodemailer from "nodemailer";
import envConfig from "../../Configs/envConfig.js";

export class NodeMailer {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: envConfig.GmailUser,
        pass: envConfig.GmailPass,
      },
    });
  }

  async sendMail(to: string, subject: string, text?: string, html?: string) {
    const mailOptions = {
      from: envConfig.GmailUser,
      to,
      subject,
      text,
      html
    };
    return await this.transporter.sendMail(mailOptions);
  }
}