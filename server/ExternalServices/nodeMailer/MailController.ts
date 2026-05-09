import { type NextFunction, type Request, type Response } from "express";
import { emailService } from "../EmailService/EmailService.js";
import { middError } from "../../Configs/errorHandlers.js";
import logger from '../../Configs/logger.js';
import envConfig from "../../Configs/envConfig.js";

export class MailController {

    static sendContactEmail = async(req: Request, res: Response, next: NextFunction) => {
        if (envConfig.Status === 'test') {
            return res.status(200).json({ message: "Mock enviado exitosamente (TEST_ENV)" });
        }
        
        try {
            const {email, issue, message } = req.body;
            
            // Forward contact messages securely to the admin's inbox
            const adminEmail = envConfig.GmailUser;
            const subject = `Nuevo mensaje de contacto de: ${email}`;
            const text = `Remitente: nomades-webSite (${email})\n\nAsunto: ${issue}\n\n${message}`;
            const replyTo= email

            await emailService.sendRawEmail({
                to: adminEmail!,
                subject,
                text,
                replyTo
            });
            logger.info('Email enviado exitosamente:'+email)
            res.status(200).json({ message: "Mensaje de contacto enviado exitosamente" });
        } catch (error) {
            logger.error(error);
            return next(middError('Ocurrio un error, mensaje no enviado', 500))
        }
    }
}
