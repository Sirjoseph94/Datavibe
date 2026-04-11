import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';
import type { RegisterInput, LoginInput } from '../schemas/auth.schema.js';
import logger from '../config/logger.js';
import { config } from '../config/index.js';

export const register = async (req: Request<{}, {}, RegisterInput>, res: Response) => {
  try {
    const { username, password } = req.body;

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) return res.status(400).json({ error: 'Username already exists' });

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        password_hash: hash,
        role: 'SUBSCRIBER'
      }
    });

    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (error: any) {
    logger.error({ err: error }, 'Registration failed');
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req: Request<{}, {}, LoginInput>, res: Response) => {
  try {

    const { username, password } = req.body;
    logger.debug({ username }, 'Login attempt');
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, config.jwtSecret, { expiresIn: '24h' });
    res.json({ token, role: user.role, username: user.username, id: user.id });
  } catch (error: any) {
    logger.error({ err: error }, 'Login failed');
    res.status(500).json({ error: error.message });
  }
};
