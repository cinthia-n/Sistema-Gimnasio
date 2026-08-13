import { z } from 'zod';

export const clientSchema = z.object({

  fullName: z
    .string()
    .min(5, 'Ingrese el nombre completo'),

  ci: z
    .string()
    .min(5, 'CI obligatorio'),

  phone: z
    .string()
    .min(7, 'Celular inválido'),

  isStudent: z.boolean(),

  birthDate: z
    .string()
    .optional(),

  gender: z
    .enum([
      'MALE',
      'FEMALE',
    ])
    .optional()
    .or(z.literal('')),

  address: z
    .string()
    .optional(),

});

export type ClientFormData =
  z.infer<typeof clientSchema>;