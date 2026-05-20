import type { Request, Response } from 'express';
export declare const getActiveGateways: (req: Request, res: Response) => Promise<void>;
export declare const getAdminGateways: (req: Request, res: Response) => Promise<void>;
export declare const updateGateway: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=gateway.controller.d.ts.map