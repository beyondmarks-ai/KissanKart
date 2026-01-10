import { z } from 'zod';

export const reviewInputSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z
    .string()
    .trim()
    .max(500, { message: 'Review must be 500 characters or less' })
    .optional()
    .nullable()
    .transform((v) => {
      const value = v?.trim();
      return value && value.length > 0 ? value : null;
    }),
});

export type ReviewInput = z.infer<typeof reviewInputSchema>;
