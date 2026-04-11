import type { Request, Response, NextFunction } from 'express';
import { ZodObject } from 'zod';
export declare const validateRequest: (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=validate.middleware.d.ts.map