import { z } from 'zod';
export declare const adminCreateSchema: z.ZodObject<{
    body: z.ZodObject<{
        username: z.ZodString;
        password: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export type AdminCreateInput = z.infer<typeof adminCreateSchema>['body'];
export declare const adminUpdateSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        username: z.ZodOptional<z.ZodString>;
        password: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type AdminUpdateInput = z.infer<typeof adminUpdateSchema>['body'];
export type AdminUpdateParams = z.infer<typeof adminUpdateSchema>['params'];
export declare const adminDeleteSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export type AdminDeleteParams = z.infer<typeof adminDeleteSchema>['params'];
//# sourceMappingURL=admin.schema.d.ts.map