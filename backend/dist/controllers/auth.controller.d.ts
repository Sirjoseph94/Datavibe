import type { Request, Response } from 'express';
import type { RegisterInput, LoginInput } from '../schemas/auth.schema.js';
export declare const register: (req: Request<{}, {}, RegisterInput>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const login: (req: Request<{}, {}, LoginInput>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=auth.controller.d.ts.map