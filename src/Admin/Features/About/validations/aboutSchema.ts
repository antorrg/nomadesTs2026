import { z } from "zod";

export const aboutBaseSchema = z.object({
    title: z.string().min(1, { message: "El título es obligatorio" }),
    picture: z.string().nullable().optional(),
    text: z.string().min(1, { message: "El texto principal es obligatorio" }),
    imgShow: z.boolean().default(true),
    enabled: z.boolean().default(true),
    useImg: z.boolean().optional(),
});

export const aboutCreateSchema = aboutBaseSchema.extend({});

export const aboutUpdateSchema = aboutBaseSchema.extend({
    saver: z.boolean().optional(),
});

export type AboutCreateFormData = z.infer<typeof aboutCreateSchema>;
export type AboutUpdateFormData = z.infer<typeof aboutUpdateSchema>;
