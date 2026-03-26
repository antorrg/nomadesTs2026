import { z } from "zod";

export const mediaBaseSchema = z.object({
    title: z.string().min(1, { message: "El título es obligatorio" }),
    text: z.string().min(1, { message: "La descripción es obligatoria" }),
    url: z.string().min(1, { message: "La URL es obligatoria" }),
    enabled: z.boolean().default(false),
});

export const mediaCreateSchema = mediaBaseSchema.extend({});

export const mediaUpdateSchema = mediaBaseSchema.extend({});

export type MediaCreateFormData = z.infer<typeof mediaCreateSchema>;
export type MediaUpdateFormData = z.infer<typeof mediaUpdateSchema>;
