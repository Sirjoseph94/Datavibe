import { z } from 'zod';
export declare const initializePaymentSchema: z.ZodObject<{
    body: z.ZodObject<{
        phoneNumber: z.ZodString;
        isp: z.ZodString;
        dataBundle: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export type InitializePaymentInput = z.infer<typeof initializePaymentSchema>['body'];
export declare const verifyPaymentSchema: z.ZodObject<{
    params: z.ZodObject<{
        reference: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export type VerifyPaymentParams = z.infer<typeof verifyPaymentSchema>['params'];
export declare const createRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        phoneNumber: z.ZodString;
        isp: z.ZodString;
        dataBundle: z.ZodString;
        amount: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateRequestInput = z.infer<typeof createRequestSchema>['body'];
//# sourceMappingURL=payment.schema.d.ts.map