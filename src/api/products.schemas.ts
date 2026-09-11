import { z } from 'zod';

// Validate the fields this suite depends on. Additional response fields are allowed.
export const productSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string(),
  category: z.string().min(1),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
});

export const productListSchema = z.object({
  products: z.array(productSchema),
  total: z.number().int().nonnegative(),
  skip: z.number().int().nonnegative(),
  limit: z.number().int().nonnegative(),
});

export const deletedProductSchema = productSchema.extend({
  isDeleted: z.literal(true),
  deletedOn: z.iso.datetime(),
});

export const apiErrorSchema = z.object({ message: z.string().min(1) });
export type Product = z.infer<typeof productSchema>;
