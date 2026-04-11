import { prisma } from '../config/prisma.config.js';
export const getBundles = async (req, res) => {
    try {
        const bundles = await prisma.ispBundle.findMany({
            orderBy: { price: 'asc' }
        });
        // Grouping by network to match legacy format if required by frontend
        const grouped = bundles.reduce((acc, bundle) => {
            if (!acc[bundle.network]) {
                acc[bundle.network] = [];
            }
            acc[bundle.network].push(bundle);
            return acc;
        }, {});
        res.json(grouped);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const createBundle = async (req, res) => {
    try {
        const { network, size, price } = req.body;
        const bundle = await prisma.ispBundle.create({
            data: { network, size, price }
        });
        res.status(201).json({ message: 'Bundle created', bundle });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const updateBundle = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const bundle = await prisma.ispBundle.update({
            where: { id },
            data: req.body
        });
        res.json({ message: 'Bundle updated', bundle });
    }
    catch (error) {
        if (error.code === 'P2025')
            return res.status(404).json({ error: 'Bundle not found' });
        res.status(500).json({ error: error.message });
    }
};
export const deleteBundle = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await prisma.ispBundle.delete({ where: { id } });
        res.json({ message: 'Bundle deleted' });
    }
    catch (error) {
        if (error.code === 'P2025')
            return res.status(404).json({ error: 'Bundle not found' });
        res.status(500).json({ error: error.message });
    }
};
//# sourceMappingURL=bundle.controller.js.map