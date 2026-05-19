import { prisma } from '../config/db.js';
import logger from '../config/logger.js';
// Get active gateways for checkout flow selection
export const getActiveGateways = async (req, res) => {
    try {
        const gateways = await prisma.paymentGateway.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                displayName: true,
                isDefault: true
            }
        });
        res.json(gateways);
    }
    catch (error) {
        logger.error({ err: error }, 'Failed to fetch active gateways');
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
// Admin route to list all gateways with their configurations
export const getAdminGateways = async (req, res) => {
    try {
        const gateways = await prisma.paymentGateway.findMany({
            orderBy: { id: 'asc' }
        });
        res.json(gateways);
    }
    catch (error) {
        logger.error({ err: error }, 'Failed to fetch admin gateways');
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
// Admin route to update configuration, active flag, or default status of a gateway
export const updateGateway = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive, isDefault, config } = req.body;
        const gatewayId = Number(id);
        if (isNaN(gatewayId)) {
            return res.status(400).json({ error: 'Invalid gateway ID' });
        }
        // Verify gateway exists
        const gateway = await prisma.paymentGateway.findUnique({
            where: { id: gatewayId }
        });
        if (!gateway) {
            return res.status(444).json({ error: 'Gateway not found' });
        }
        // If setting as default, we must unset isDefault for all other gateways
        if (isDefault) {
            await prisma.$transaction([
                prisma.paymentGateway.updateMany({
                    where: { id: { not: gatewayId } },
                    data: { isDefault: false }
                }),
                prisma.paymentGateway.update({
                    where: { id: gatewayId },
                    data: {
                        isActive: true, // A default gateway must be active
                        isDefault: true,
                        config: typeof config === 'string' ? config : JSON.stringify(config)
                    }
                })
            ]);
        }
        else {
            // If we are unsetting default, make sure we aren't unsetting the only default
            if (gateway.isDefault) {
                const otherDefault = await prisma.paymentGateway.findFirst({
                    where: {
                        id: { not: gatewayId },
                        isDefault: true
                    }
                });
                if (!otherDefault) {
                    return res.status(400).json({ error: 'Cannot unset default. At least one gateway must be marked as default.' });
                }
            }
            await prisma.paymentGateway.update({
                where: { id: gatewayId },
                data: {
                    isActive: isActive !== undefined ? isActive : gateway.isActive,
                    isDefault: false,
                    config: config !== undefined ? (typeof config === 'string' ? config : JSON.stringify(config)) : gateway.config
                }
            });
        }
        const updated = await prisma.paymentGateway.findUnique({
            where: { id: gatewayId }
        });
        res.json({ message: 'Gateway updated successfully', gateway: updated });
    }
    catch (error) {
        logger.error({ err: error }, 'Failed to update gateway settings');
        res.status(500).json({ error: error.message });
    }
};
//# sourceMappingURL=gateway.controller.js.map