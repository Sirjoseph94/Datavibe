import type { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import type { CreateRequestInput } from '../schemas/payment.schema.js';
import logger from '../config/logger.js';

function validateNigerianPhone(phone: string) {
  const normalized = String(phone).replace(/^\+?234/, '0').replace(/\s+/g, '');
  if (normalized.length !== 11 || !/^0\d{10}$/.test(normalized)) {
    return { valid: false, message: 'Please enter a valid 11-digit Nigerian phone number (e.g. 0801...)' };
  }
  return { valid: true, normalized };
}

export const createRequest = async (req: Request<{}, {}, CreateRequestInput>, res: Response) => {
  try {
    const { phoneNumber, isp, dataBundle, amount } = req.body;

    const phoneValidation = validateNigerianPhone(phoneNumber);
    if (!phoneValidation.valid) {
      return res.status(400).json({ error: phoneValidation.message });
    }


    const request = await prisma.request.create({
      data: {
        subscriberId: req.user ? req.user.id : null,
        phoneNumber: phoneValidation.normalized!,
        isp,
        dataBundle,
        amount
      }
    });

    res.status(201).json({ message: 'Request created', requestId: request.id });
  } catch (error: any) {
    logger.error({ err: error }, 'Failed to create request');
    res.status(500).json({ error: error.message });
  }
};

export const getRequests = async (req: Request, res: Response) => {
  const { status, page, limit, search, isp } = req.query;
  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 20;

  try {
    const where: any = req.user.role === 'SUBSCRIBER' ? { subscriberId: req.user.id } : {};

    if (search) {
      where.OR = [
        { phoneNumber: { contains: search as string, mode: 'insensitive' } },
        { subscriber: { username: { contains: search as string, mode: 'insensitive' } } },
      ];
    }
    if (isp) {
      where.isp = isp as string;
    }
    if (status) {
      where.status = status as string;
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

    const requests = baseRequests.map((data: any) => {
      const { subscriber, ...rest } = data;
      return { ...rest, subscriberName: subscriber ? subscriber.username : null };
    });

    res.json({ data: requests, total, page: pageNum, limit: limitNum });
  } catch (error: any) {
    logger.error({ err: error }, 'Failed to fetch requests');
    res.status(500).json({ error: error.message });
  }
};

export const treatRequest = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    logger.error({ err: error }, 'Failed to treat request');
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.status(500).json({ error: error.message });
  }
};
