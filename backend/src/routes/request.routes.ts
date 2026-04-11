import { Router } from 'express';
import { createRequest, getRequests, treatRequest } from '../controllers/request.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { createRequestSchema } from '../schemas/payment.schema.js'; // reused since structure is matching
import { optionalAuthenticateToken, authenticateToken, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', optionalAuthenticateToken, validateRequest(createRequestSchema), createRequest);
router.get('/', authenticateToken, getRequests);
router.put('/:id/treat', authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']), treatRequest);

export default router;
