import { Router } from 'express';
import { getBundles, createBundle, updateBundle, deleteBundle } from '../controllers/bundle.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { createBundleSchema, updateBundleSchema, deleteBundleSchema } from '../schemas/bundle.schema.js';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware.js';
const router = Router();
// Public route to get bundles
router.get('/', getBundles);
// Secured admin routes for modifying bundles
router.use(authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']));
router.post('/', validateRequest(createBundleSchema), createBundle);
router.put('/:id', validateRequest(updateBundleSchema), updateBundle);
router.delete('/:id', validateRequest(deleteBundleSchema), deleteBundle);
export default router;
//# sourceMappingURL=bundle.routes.js.map