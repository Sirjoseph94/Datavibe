import { Router } from 'express';
import { getAdmins, createAdmin, updateAdmin, deleteAdmin } from '../controllers/admin.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { adminCreateSchema, adminUpdateSchema, adminDeleteSchema } from '../schemas/admin.schema.js';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware.js';
const router = Router();
router.use(authenticateToken, requireRole(['SUPER_ADMIN']));
router.get('/', getAdmins);
router.post('/', validateRequest(adminCreateSchema), createAdmin);
router.put('/:id', validateRequest(adminUpdateSchema), updateAdmin);
router.delete('/:id', validateRequest(adminDeleteSchema), deleteAdmin);
export default router;
//# sourceMappingURL=admin.routes.js.map