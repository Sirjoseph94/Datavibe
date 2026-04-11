import bcrypt from 'bcrypt';
import { prisma } from '../config/db';
import logger from '../config/logger.js';
export const getAdmins = async (req, res) => {
    try {
        const { search } = req.query;
        const where = search ? { username: { contains: search, mode: 'insensitive' } } : {};
        const admins = await prisma.user.findMany({
            where: { role: 'ADMIN', ...where },
            select: { id: true, username: true, createdAt: true }
        });
        res.json(admins);
    }
    catch (error) {
        logger.error({ err: error }, 'Failed to fetch admins');
        res.status(500).json({ error: error.message });
    }
};
export const createAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const existing = await prisma.user.findUnique({ where: { username } });
        if (existing)
            return res.status(400).json({ error: 'Username already exists' });
        const hash = await bcrypt.hash(password, 10);
        const admin = await prisma.user.create({
            data: { username, password_hash: hash, role: 'ADMIN' }
        });
        res.status(201).json({ message: 'Admin created successfully', adminId: admin.id });
    }
    catch (error) {
        logger.error({ err: error }, 'Failed to create admin');
        res.status(500).json({ error: error.message });
    }
};
export const updateAdmin = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { username, password } = req.body;
        const admin = await prisma.user.findUnique({ where: { id } });
        if (!admin || admin.role !== 'ADMIN')
            return res.status(404).json({ error: 'Admin not found' });
        let updateData = {};
        if (username) {
            const existing = await prisma.user.findUnique({ where: { username } });
            if (existing && existing.id !== id)
                return res.status(400).json({ error: 'Username already exists' });
            updateData.username = username;
        }
        if (password) {
            updateData.password_hash = await bcrypt.hash(password, 10);
        }
        await prisma.user.update({
            where: { id },
            data: updateData
        });
        res.json({ message: 'Admin updated successfully' });
    }
    catch (error) {
        logger.error({ err: error }, 'Failed to update admin');
        res.status(500).json({ error: error.message });
    }
};
export const deleteAdmin = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const admin = await prisma.user.findUnique({ where: { id } });
        if (!admin || admin.role !== 'ADMIN')
            return res.status(404).json({ error: 'Admin not found' });
        // Remove foreign key references from treated requests before deletion
        await prisma.request.updateMany({
            where: { treatedBy: id },
            data: { treatedBy: null }
        });
        await prisma.user.delete({ where: { id } });
        res.json({ message: 'Admin deleted successfully' });
    }
    catch (error) {
        logger.error({ err: error }, 'Failed to delete admin');
        res.status(500).json({ error: error.message });
    }
};
//# sourceMappingURL=admin.controller.js.map