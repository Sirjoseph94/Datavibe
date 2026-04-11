import { Router } from 'express';
import authRoutes from './auth.routes.js';
import bundleRoutes from './bundle.routes.js';
import paymentRoutes from './payment.routes.js';
import requestRoutes from './request.routes.js';
import statsRoutes from './stats.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();
router.use('/auth', authRoutes);
router.use('/bundles', bundleRoutes);
router.use('/paystack', paymentRoutes);
router.use('/requests', requestRoutes);
router.use('/stats', statsRoutes);
router.use('/admins', adminRoutes);

export default router;
