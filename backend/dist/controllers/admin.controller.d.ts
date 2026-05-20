import type { Request, Response } from 'express';
import type { AdminCreateInput, AdminUpdateInput, AdminUpdateParams, AdminDeleteParams } from '../schemas/admin.schema.js';
export declare const getAdmins: (req: Request, res: Response) => Promise<void>;
export declare const createAdmin: (req: Request<{}, {}, AdminCreateInput>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateAdmin: (req: Request<AdminUpdateParams, {}, AdminUpdateInput>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteAdmin: (req: Request<AdminDeleteParams>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=admin.controller.d.ts.map