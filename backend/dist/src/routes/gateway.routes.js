import { Router } from 'express';
import { getActiveGateways, getAdminGateways, updateGateway } from '../controllers/gateway.controller.js';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware.js';
const router = Router();
// Public route to fetch active gateways for checkout select
router.get('/', getActiveGateways);
// Admin-secured routes to manage gateways
router.get('/admin', authenticateToken, requireRole(['SUPER_ADMIN']), getAdminGateways);
router.put('/admin/:id', authenticateToken, requireRole(['SUPER_ADMIN']), updateGateway);
export default router;
//# sourceMappingURL=gateway.routes.js.map