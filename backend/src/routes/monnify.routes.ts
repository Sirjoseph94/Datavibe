import { Router } from 'express';
import { initializeMonnifyPayment, verifyMonnifyPayment } from '../controllers/monnify.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { initializePaymentSchema, verifyPaymentSchema } from '../schemas/payment.schema.js';
import { optionalAuthenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/initialize', optionalAuthenticateToken, validateRequest(initializePaymentSchema), initializeMonnifyPayment);
router.post('/verify/:reference', validateRequest(verifyPaymentSchema), verifyMonnifyPayment);

export default router;
