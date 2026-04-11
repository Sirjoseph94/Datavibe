import { z } from 'zod';

export const createBundleSchema = z.object({
  body: z.object({
    network: z.string().min(1, "Network is required"),
    size: z.string().min(1, "Size is required"),
    price: z.number().positive("Price must be positive")
  })
});

export type BundleCreateInput = z.infer<typeof createBundleSchema>['body'];

export const updateBundleSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID must be a number")
  }),
  body: z.object({
    network: z.string().min(1, "Network is required").optional(),
    size: z.string().min(1, "Size is required").optional(),
    price: z.number().positive("Price must be positive").optional()
  })
});

export type BundleUpdateInput = z.infer<typeof updateBundleSchema>['body'];
export type BundleUpdateParams = z.infer<typeof updateBundleSchema>['params'];

export const deleteBundleSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID must be a number")
  })
});

export type BundleDeleteParams = z.infer<typeof deleteBundleSchema>['params'];
