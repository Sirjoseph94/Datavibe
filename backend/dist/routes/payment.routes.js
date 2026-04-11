import { Router } from 'express';
import { initializePayment, verifyPayment } from '../controllers/payment.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { initializePaymentSchema, verifyPaymentSchema } from '../schemas/payment.schema.js';
import { optionalAuthenticateToken } from '../middlewares/auth.middleware.js';
const router = Router();
router.post('/initialize', optionalAuthenticateToken, validateRequest(initializePaymentSchema), initializePayment);
router.post('/verify/:reference', validateRequest(verifyPaymentSchema), verifyPayment);
export default router;
//# sourceMappingURL=payment.routes.js.map