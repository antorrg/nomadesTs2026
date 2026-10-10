import { z } from "zod";

export const YOUTUBE_URL_REGEX = /(?:https?:\/\/(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/))([^?\s&]+)/i;
export const INSTAGRAM_URL_REGEX = /(?:instagram\.com|instagr\.am)\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/i;
export const FACEBOOK_URL_REGEX = /(?:facebook\.com|fb\.watch|fb\.gg)/i;

export const createMediaSchema = (mediaType?: string) => {
    let urlSchema = z.string().min(1, { message: "La URL es obligatoria" });

    const cleanType = mediaType?.toLowerCase().replace(/^type:/, '') || '';

    if (cleanType === 'youtube') {
        urlSchema = urlSchema.regex(
            YOUTUBE_URL_REGEX,
            "Formato inválido. Ingrese un enlace válido de YouTube (videos, Shorts o transmisiones)"
        );
    } else if (cleanType === 'instagram') {
        urlSchema = urlSchema.regex(
            INSTAGRAM_URL_REGEX,
            "Formato inválido. Ingrese un enlace válido de Instagram (Reels, publicaciones o IGTV)"
        );
    } else if (cleanType === 'facebook') {
        urlSchema = urlSchema.regex(
            FACEBOOK_URL_REGEX,
            "Formato inválido. Ingrese un enlace válido de Facebook"
        );
    }

    return z.object({
        title: z.string().min(1, { message: "El título es obligatorio" }),
        text: z.string().min(1, { message: "La descripción es obligatoria" }),
        url: urlSchema,
        enabled: z.boolean().default(true),
    });
};

export const mediaBaseSchema = createMediaSchema();
export const mediaCreateSchema = mediaBaseSchema;
export const mediaUpdateSchema = mediaBaseSchema;

export type MediaCreateFormData = z.infer<typeof mediaBaseSchema>;
export type MediaUpdateFormData = z.infer<typeof mediaBaseSchema>;
