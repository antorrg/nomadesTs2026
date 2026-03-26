import { z } from "zod";

export const frontPageBaseSchema = z.object({
    title: z.string().min(1, { message: "El título es obligatorio" }),
    picture: z.string().nullable().optional(),
    info_header: z.string().min(1, { message: "La información de posicionamiento es obligatoria" }),
    description: z.string().min(1, { message: "La descripción es obligatoria" }),
    enabled: z.boolean().default(true),
    useImg: z.boolean().optional(),
});

export const frontPageCreateSchema = frontPageBaseSchema.extend({});

export const frontPageUpdateSchema = frontPageBaseSchema.extend({
    saver: z.boolean().optional(),
});

export type FrontPageCreateFormData = z.infer<typeof frontPageCreateSchema>;
export type FrontPageUpdateFormData = z.infer<typeof frontPageUpdateSchema>;
