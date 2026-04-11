import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_123';
export const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const existing = await prisma.user.findUnique({ where: { username } });
        if (existing)
            return res.status(400).json({ error: 'Username already exists' });
        const hash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                username,
                password_hash: hash,
                role: 'SUBSCRIBER'
            }
        });
        res.status(201).json({ message: 'User registered successfully', userId: user.id });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user)
            return res.status(400).json({ error: 'Invalid credentials' });
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch)
            return res.status(400).json({ error: 'Invalid credentials' });
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, role: user.role, username: user.username, id: user.id });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//# sourceMappingURL=auth.controller.js.map