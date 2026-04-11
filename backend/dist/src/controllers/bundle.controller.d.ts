import type { Request, Response } from 'express';
import type { BundleCreateInput, BundleUpdateInput, BundleUpdateParams, BundleDeleteParams } from '../schemas/bundle.schema.js';
export declare const getBundles: (req: Request, res: Response) => Promise<void>;
export declare const createBundle: (req: Request<{}, {}, BundleCreateInput>, res: Response) => Promise<void>;
export declare const updateBundle: (req: Request<BundleUpdateParams, {}, BundleUpdateInput>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteBundle: (req: Request<BundleDeleteParams>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=bundle.controller.d.ts.map