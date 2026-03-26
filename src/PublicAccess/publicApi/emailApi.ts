//import { api, publicApi } from './axios';
import { publicApi } from '../../api/api';
import type { EmailInput } from '../Features/Contact/validContact';

type Email = EmailInput


export const emailPublicApi = {
    sendEmails: async (data:Email ): Promise<void> => {
        const response = await publicApi.execute({

            request: {
                method: 'post',
                endpoint: 'mail',
                data
            },
            hasMessage: true,
            // errorMessage: 'Algo paso'
        })
        return 
    },
    handleWhatsApp: () => {
        const phoneNumber = import.meta.env.VITE_PHONE; // Reemplaza con tu número (incluye código de país)
        const message = import.meta.env.VITE_MESSAGE // Mensaje predeterminado
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
    },
    handleFacebook: () => { },

    handleInstagram: () => {

    }
}
