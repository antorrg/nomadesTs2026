import { type Request, type Response } from "express";
import { NodeMailer } from "./NodeMailer.js";
import logger from '../../Configs/logger.js';
import envConfig from "../../Configs/envConfig.js";

export class MailController {

    static sendContactEmail = async(req: Request, res: Response) => {
        if (envConfig.Status === 'test') {
            return res.status(200).json({ message: "Mock enviado exitosamente (TEST_ENV)" });
        }
        
        try {
            const { name, email, message } = req.body;
            const mailer = new NodeMailer();
            
            // Forward contact messages securely to the admin's inbox
            const adminEmail = envConfig.GmailUser;
            const subject = `Nuevo mensaje de contacto de: ${name}`;
            const text = `Remitente: ${name} (${email})\n\n${message}`;

            await mailer.sendMail(adminEmail!, subject, text);
            res.status(200).json({ message: "Mensaje de contacto enviado exitosamente" });
        } catch (error) {
            logger.error(error);
        }
    }

    // Direct binding for UserService injection (not a raw Express middleware)
    static resetPasswordEmail = async(email: string, plainPassword: string): Promise<void> => {
        if (envConfig.Status === 'test') {
            logger.info(`[Test Env Mock] Simulated password reset mail generated to: ${email}`);
            return;
        }

        try {
            const mailer = new NodeMailer();
            const subject = "Restablecimiento de Contraseña - Nómades";
            const text = `Su nueva contraseña de acceso es: ${plainPassword}\nPor favor inicie sesión y cámbiela en su panel de perfil lo antes posible.`;
            
            await mailer.sendMail(email, subject, text);
        } catch (error) {
           logger.error( error);
           throw error; // Let the UserService know it failed if necessary
        }
    }
}
