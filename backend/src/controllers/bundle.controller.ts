import type { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import type { BundleCreateInput, BundleUpdateInput, BundleUpdateParams, BundleDeleteParams } from '../schemas/bundle.schema.js';
import logger from '../config/logger.js';

export const getBundles = async (req: Request, res: Response) => {
  try {
    const bundles = await prisma.ispBundle.findMany({
      orderBy: { price: 'asc' }
    });

    // Grouping by network to match legacy format if required by frontend
    const grouped = bundles.reduce((acc: any, bundle: any) => {
      if (!acc[bundle.network]) {
        acc[bundle.network] = [];
      }
      acc[bundle.network].push(bundle);
      return acc;
    }, {} as Record<string, any[]>);

    res.json(grouped);
  } catch (error: any) {
    logger.error({ err: error }, 'Failed to fetch bundles');
    res.status(500).json({ error: error.message });
  }
};

export const createBundle = async (req: Request<{}, {}, BundleCreateInput>, res: Response) => {
  try {
    const { network, size, price } = req.body;
    const bundle = await prisma.ispBundle.create({
      data: { network, size, price }
    });
    res.status(201).json({ message: 'Bundle created', bundle });
  } catch (error: any) {
    logger.error({ err: error }, 'Failed to create bundle');
    res.status(500).json({ error: error.message });
  }
};

export const updateBundle = async (req: Request<BundleUpdateParams, {}, BundleUpdateInput>, res: Response) => {
  try {
    const id = Number(req.params.id);
    const bundle = await prisma.ispBundle.update({
      where: { id },
      data: req.body
    });
    res.json({ message: 'Bundle updated', bundle });
  } catch (error: any) {
    logger.error({ err: error }, 'Failed to update bundle');
    if (error.code === 'P2025') return res.status(404).json({ error: 'Bundle not found' });
    res.status(500).json({ error: error.message });
  }
};

export const deleteBundle = async (req: Request<BundleDeleteParams>, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.ispBundle.delete({ where: { id } });
    res.json({ message: 'Bundle deleted' });
  } catch (error: any) {
    logger.error({ err: error }, 'Failed to delete bundle');
    if (error.code === 'P2025') return res.status(404).json({ error: 'Bundle not found' });
    res.status(500).json({ error: error.message });
  }
};
