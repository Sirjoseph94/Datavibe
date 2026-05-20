import { z } from 'zod';
export declare const createBundleSchema: z.ZodObject<{
    body: z.ZodObject<{
        network: z.ZodString;
        size: z.ZodString;
        price: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export type BundleCreateInput = z.infer<typeof createBundleSchema>['body'];
export declare const updateBundleSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        network: z.ZodOptional<z.ZodString>;
        size: z.ZodOptional<z.ZodString>;
        price: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type BundleUpdateInput = z.infer<typeof updateBundleSchema>['body'];
export type BundleUpdateParams = z.infer<typeof updateBundleSchema>['params'];
export declare const deleteBundleSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export type BundleDeleteParams = z.infer<typeof deleteBundleSchema>['params'];
//# sourceMappingURL=bundle.schema.d.ts.map