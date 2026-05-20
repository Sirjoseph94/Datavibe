import { z } from 'zod';
export const initializePaymentSchema = z.object({
    body: z.object({
        phoneNumber: z.string().min(10, "Phone number is required"),
        isp: z.string().min(1, "ISP is required"),
        dataBundle: z.string().min(1, "Data bundle is required")
    })
});
export const verifyPaymentSchema = z.object({
    params: z.object({
        reference: z.string().min(1, "Reference is required")
    })
});
export const createRequestSchema = z.object({
    body: z.object({
        phoneNumber: z.string().min(10, "Phone number is required"),
        isp: z.string().min(1, "ISP is required"),
        dataBundle: z.string().min(1, "Data bundle is required"),
        amount: z.number().positive("Amount must be positive")
    })
});
//# sourceMappingURL=payment.schema.js.map