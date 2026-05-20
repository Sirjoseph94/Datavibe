import type { Request, Response } from 'express';
import type { CreateRequestInput } from '../schemas/payment.schema.js';
export declare const createRequest: (req: Request<{}, {}, CreateRequestInput>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getRequests: (req: Request, res: Response) => Promise<void>;
export declare const treatRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=request.controller.d.ts.map