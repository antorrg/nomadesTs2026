import { z } from "zod";

export const highLightBaseSchema = z.object({
    title: z.string().min(1, { message: "El título es obligatorio" }),
    picture: z.string().nullable().optional(),
    text: z.string().min(1, { message: "El texto es obligatorio" }),
    showTitle: z.boolean().default(true),
    enabled: z.boolean().default(false),
    useImg: z.boolean().optional(),
});

export const highLightCreateSchema = highLightBaseSchema.extend({});

export const highLightUpdateSchema = highLightBaseSchema.extend({
    saver: z.boolean().optional(),
    order: z
        .number({ message: "El orden debe ser un número" })
        .int({ message: "El orden debe ser un número entero" })
        .min(0, { message: "El orden no puede ser negativo" })
        .nullable()
        .optional(),
});

export type HighLightCreateFormData = z.infer<typeof highLightCreateSchema>;
export type HighLightUpdateFormData = z.infer<typeof highLightUpdateSchema>;
