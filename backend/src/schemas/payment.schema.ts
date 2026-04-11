import { z } from 'zod';

export const initializePaymentSchema = z.object({
  body: z.object({
    phoneNumber: z.string().min(10, "Phone number is required"),
    isp: z.string().min(1, "ISP is required"),
    dataBundle: z.string().min(1, "Data bundle is required")
  })
});

export type InitializePaymentInput = z.infer<typeof initializePaymentSchema>['body'];

export const verifyPaymentSchema = z.object({
  params: z.object({
    reference: z.string().min(1, "Reference is required")
  })
});

export type VerifyPaymentParams = z.infer<typeof verifyPaymentSchema>['params'];

export const createRequestSchema = z.object({
  body: z.object({
    phoneNumber: z.string().min(10, "Phone number is required"),
    isp: z.string().min(1, "ISP is required"),
    dataBundle: z.string().min(1, "Data bundle is required"),
    amount: z.number().positive("Amount must be positive")
  })
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>['body'];
