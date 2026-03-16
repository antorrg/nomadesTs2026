//import { api, publicApi } from './axios';
import { publicApi } from '../../api/api';
import type { ILanding, LandingResults,} from '../../types/landing';


export const landingPublicApi = {
    getAllPublic: async (): Promise<LandingResults[]> => {
        const response = await publicApi.execute<LandingResults[]>({

            request: {
                method: 'get',
                endpoint: 'landing/public'
            },
            hasMessage: false,
            // errorMessage: 'Algo paso'
        })
        return response || []
    },
    getPublicById: async (id: number): Promise<ILanding> => {
        const response = await publicApi.execute({
            request: {
                method: 'get',
                endpoint: `landing/public/${id}`
            },
            hasMessage: true,
            // errorMessage: 'Algo paso'
        })
        return response as ILanding
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

