import { z } from 'zod';

export const userUpdateSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  nickname: z.string().nullable().optional(),
  name: z.string().min(1, "El nombre es obligatorio"),
  picture: z.string().nullable().optional(),
});

export type UserUpdateFormValues = z.infer<typeof userUpdateSchema>;

export const userCreateSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().regex(/^(?=.*[A-Z]).{8,}$/, "La contraseña debe tener al menos 8 caracteres y una mayúscula")
});

export type UserCreateFormValues = z.infer<typeof userCreateSchema>;

export const passwordChangeSchema = z.object({
  password: z.string().min(1, "La contraseña actual es obligatoria"),
  newPassword: z.string().regex(/^(?=.*[A-Z]).{8,}$/, "La contraseña debe tener al menos 8 caracteres y una mayúscula"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;
