import type { Request, Response } from 'express';
import type { InitializePaymentInput, VerifyPaymentParams } from '../schemas/payment.schema.js';
export declare const initializePayment: (req: Request<{}, {}, InitializePaymentInput>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const verifyPayment: (req: Request<VerifyPaymentParams>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=payment.controller.d.ts.map