import { Router } from 'express';
import { getStats } from '../controllers/stats.controller.js';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware.js';
const router = Router();
router.get('/', authenticateToken, requireRole(['SUPER_ADMIN']), getStats);
export default router;
//# sourceMappingURL=stats.routes.js.map