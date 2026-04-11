import { prisma } from '../config/db.js';
import logger from '../config/logger.js';
function validateNigerianPhone(phone) {
    const normalized = String(phone).replace(/^\+?234/, '0').replace(/\s+/g, '');
    if (normalized.length !== 11 || !/^0\d{10}$/.test(normalized)) {
        return { valid: false, message: 'Please enter a valid 11-digit Nigerian phone number (e.g. 0801...)' };
    }
    return { valid: true, normalized };
}
export const createRequest = async (req, res) => {
    try {
        const { phoneNumber, isp, dataBundle, amount } = req.body;
        const phoneValidation = validateNigerianPhone(phoneNumber);
        if (!phoneValidation.valid) {
            return res.status(400).json({ error: phoneValidation.message });
        }
        const request = await prisma.request.create({
            data: {
                subscriberId: req.user ? req.user.id : null,
                phoneNumber: phoneValidation.normalized,
                isp,
                dataBundle,
                amount
            }
        });
        res.status(201).json({ message: 'Request created', requestId: request.id });
    }
    catch (error) {
        logger.error({ err: error }, 'Failed to create request');
        res.status(500).json({ error: error.message });
    }
};
export const getRequests = async (req, res) => {
    const { status, page, limit, search, isp } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    try {
        const where = req.user.role === 'SUBSCRIBER' ? { subscriberId: req.user.id } : {};
        if (search) {
            where.OR = [
                { phoneNumber: { contains: search, mode: 'insensitive' } },
                { subscriber: { username: { contains: search, mode: 'insensitive' } } },
            ];
        }
        if (isp) {
            where.isp = isp;
        }
        if (status) {
            where.status = status;
        }
        const [baseRequests, total] = await Promise.all([
            prisma.request.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                include: { subscriber: true },
                skip: (pageNum - 1) * limitNum,
                take: limitNum,
            }),
            prisma.request.count({ where }),
        ]);
        const requests = baseRequests.map((data) => {
            const { subscriber, ...rest } = data;
            return { ...rest, subscriberName: subscriber ? subscriber.username : null };
        });
        res.json({ data: requests, total, page: pageNum, limit: limitNum });
    }
    catch (error) {
        logger.error({ err: error }, 'Failed to fetch requests');
        res.status(500).json({ error: error.message });
    }
};
export const treatRequest = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await prisma.request.update({
            where: { id },
            data: {
                status: 'treated',
                treatedBy: req.user.id,
                updatedAt: new Date()
            }
        });
        res.json({ message: 'Request treated successfully' });
    }
    catch (error) {
        logger.error({ err: error }, 'Failed to treat request');
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Request not found' });
        }
        res.status(500).json({ error: error.message });
    }
};
//# sourceMappingURL=request.controller.js.map