import type { Request, Response } from 'express';
import { Prisma } from '../generated/prisma/client.js';
import type { InitializePaymentInput, VerifyPaymentParams } from '../schemas/payment.schema.js';
import { prisma } from '../config/db.js';
import logger from '../config/logger.js';
import { decryptConfig } from '../utils/encryption.js';

const getPaystackConfig = async () => {
  const gateway = await prisma.paymentGateway.findUnique({
    where: { name: 'paystack' }
  });

  let secretKey = process.env.PAYSTACK_SECRET_KEY || "";

  if (gateway && gateway.config) {
    try {
      const decrypted = decryptConfig(gateway.config);
      const parsed = JSON.parse(decrypted);
      if (parsed.secretKey) secretKey = parsed.secretKey;
    } catch (e) {
      logger.error({ err: e }, 'Failed to parse Paystack DB config, falling back to ENV');
    }
  }

  return { secretKey };
};

function validateNigerianPhone(phone: string) {
  const normalized = String(phone).replace(/^\+?234/, '0').replace(/\s+/g, '');
  if (normalized.length !== 11 || !/^0\d{10}$/.test(normalized)) {
    return { valid: false, message: 'Please enter a valid 11-digit Nigerian phone number (e.g. 0801...)' };
  }
  return { valid: true, normalized };
}

export const initializePayment = async (req: Request<{}, {}, InitializePaymentInput>, res: Response) => {
  try {
    const { phoneNumber, isp, dataBundle } = req.body;

    const phoneValidation = validateNigerianPhone(phoneNumber);
    if (!phoneValidation.valid) {
      return res.status(400).json({ error: phoneValidation.message });
    }
    const validatedPhone = phoneValidation.normalized;

    const selectedBundle = await prisma.ispBundle.findFirst({
      where: { network: isp, size: dataBundle }
    });

    if (!selectedBundle) return res.status(400).json({ error: 'Invalid bundle selected' });

    const amount = selectedBundle.price;
    const subscriberId = req.user ? req.user.id : null;
    const email = req.user ? req.user.username + '@datasub.com' : `guest_${validatedPhone}@datasub.com`;
    logger.info({ email }, 'Email');

    const { secretKey } = await getPaystackConfig();
    if (!secretKey) {
      return res.status(400).json({ error: 'Paystack Secret Key is not configured.' });
    }

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amount * 100, // kobo
        email,
        callback_url: `${process.env.FRONTEND_URL}/verify`,
        metadata: {
          phoneNumber: validatedPhone,
          isp,
          dataBundle,
          amount,
          subscriberId
        }
      })
    });

    const data = await response.json();
    if (!data.status) throw new Error(data.message);

    res.json({ authorization_url: data.data.authorization_url, reference: data.data.reference });
  } catch (error: any) {
    logger.error({ err: error }, 'Failed to initialize payment');
    res.status(500).json({ error: error.message });
  }
};

export const verifyPayment = async (req: Request<VerifyPaymentParams>, res: Response) => {
  try {
    const { reference } = req.params;

    const existing = await prisma.request.findUnique({ where: { reference } });
    if (existing) return res.status(400).json({ error: 'Transaction already verified' });

    const { secretKey } = await getPaystackConfig();
    if (!secretKey) {
      return res.status(400).json({ error: 'Paystack Secret Key is not configured.' });
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${secretKey}`
      }
    });

    const data = await response.json();
    if (!data.status || data.data.status !== 'success') {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    const meta = data.data.metadata;
    const request = await prisma.request.create({
      data: {
        subscriberId: meta?.subscriberId === "" ? null : Number(meta?.subscriberId),
        phoneNumber: meta.phoneNumber,
        isp: meta.isp,
        dataBundle: meta.dataBundle,
        amount: Number(meta.amount),
        reference: reference,
        status: 'pending'
      }
    });

    res.json({ message: 'Payment successful and request created', request });
  } catch (error: any) {
    logger.error({ err: error }, 'Failed to verify payment');
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Transaction already verified' });
      }
    }
    res.status(500).json({ error: error.message });
  }
};
