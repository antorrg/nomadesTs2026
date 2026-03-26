import { z } from "zod";

export const workBaseSchema = z.object({
    title: z.string().min(1, { message: "El título es obligatorio" }),
    picture: z.string().nullable().optional(),
    text: z.string().min(1, { message: "El texto es obligatorio" }),
    enabled: z.boolean().default(false),
    useImg: z.boolean().optional(),
});

export const workCreateSchema = workBaseSchema.extend({});

export const workUpdateSchema = workBaseSchema.extend({
    saver: z.boolean().optional(),
});

export type WorkCreateFormData = z.infer<typeof workCreateSchema>;
export type WorkUpdateFormData = z.infer<typeof workUpdateSchema>;
