import type { Request, Response } from 'express';
import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../config/db.js';
import logger from '../config/logger.js';
import { decryptConfig } from '../utils/encryption.js';

// Helper to validate Nigerian phone numbers
function validateNigerianPhone(phone: string) {
  const normalized = String(phone).replace(/^\+?234/, '0').replace(/\s+/g, '');
  if (normalized.length !== 11 || !/^0\d{10}$/.test(normalized)) {
    return { valid: false, message: 'Please enter a valid 11-digit Nigerian phone number (e.g. 0801...)' };
  }
  return { valid: true, normalized };
}

// Fetch active Monnify configurations from the DB with env fallbacks
const getMonnifyConfig = async () => {
  const gateway = await prisma.paymentGateway.findUnique({
    where: { name: 'monnify' }
  });

  let apiKey = process.env.MONNIFY_API_KEY || "";
  let secretKey = process.env.MONNIFY_SECRET_KEY || "";
  let contractCode = process.env.MONNIFY_CONTRACT_CODE || "";
  let isSandbox = process.env.MONNIFY_IS_SANDBOX !== 'false';

  if (gateway && gateway.config) {
    try {
      const decrypted = decryptConfig(gateway.config);
      const parsed = JSON.parse(decrypted);
      if (parsed.apiKey) apiKey = parsed.apiKey;
      if (parsed.secretKey) secretKey = parsed.secretKey;
      if (parsed.contractCode) contractCode = parsed.contractCode;
      if (parsed.isSandbox !== undefined) {
        isSandbox = parsed.isSandbox === true || parsed.isSandbox === 'true';
      }
    } catch (e) {
      logger.error({ err: e }, 'Failed to parse Monnify DB config, falling back to ENV');
    }
  }

  const baseUrl = isSandbox ? 'https://sandbox.monnify.com' : 'https://api.monnify.com';

  return { apiKey, secretKey, contractCode, baseUrl };
};

// Fetch OAuth 2.0 Access Token from Monnify
const getAccessToken = async (apiKey: string, secretKey: string, baseUrl: string) => {
  if (!apiKey || !secretKey) {
    throw new Error('Monnify API Key and Secret Key must be configured.');
  }

  const authString = Buffer.from(`${apiKey}:${secretKey}`).toString('base64');
  const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${authString}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Monnify login failed with status ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  if (!data.requestSuccessful || !data.responseBody?.accessToken) {
    throw new Error(`Monnify auth token generation failed: ${data.responseMessage || 'unknown error'}`);
  }

  return data.responseBody.accessToken;
};

// POST /api/monnify/initialize
export const initializeMonnifyPayment = async (req: Request, res: Response) => {
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
    const fullName = req.user ? req.user.username : 'Guest User';

    const { apiKey, secretKey, contractCode, baseUrl } = await getMonnifyConfig();

    if (!contractCode) {
      return res.status(400).json({ error: 'Monnify Contract Code is not configured.' });
    }

    const accessToken = await getAccessToken(apiKey, secretKey, baseUrl);
    const paymentReference = `MON_${Date.now()}_${Math.floor(100000 + Math.random() * 900000)}`;

    const response = await fetch(`${baseUrl}/api/v1/merchant/transactions/init-transaction`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amount,
        customerName: fullName,
        customerEmail: email,
        paymentReference,
        paymentDescription: `${isp} ${dataBundle} Data Purchase`,
        currencyCode: 'NGN',
        contractCode,
        redirectUrl: `${process.env.FRONTEND_URL}/verify`,
        paymentMethods: ['CARD', 'ACCOUNT_TRANSFER'],
        metaData: {
          phoneNumber: validatedPhone,
          isp,
          dataBundle,
          amount: String(amount),
          subscriberId: subscriberId ? String(subscriberId) : ""
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Monnify init transaction failed: ${errorText}`);
    }

    const data = await response.json();
    if (!data.requestSuccessful || !data.responseBody?.checkoutUrl) {
      throw new Error(`Monnify initialization failed: ${data.responseMessage || 'unknown error'}`);
    }

    res.json({
      authorization_url: data.responseBody.checkoutUrl,
      reference: paymentReference
    });
  } catch (error: any) {
    logger.error({ err: error }, 'Failed to initialize Monnify payment');
    res.status(500).json({ error: error.message });
  }
};

// POST /api/monnify/verify/:reference
export const verifyMonnifyPayment = async (req: Request, res: Response) => {
  try {
    const reference = req.params.reference as string;

    const existing = await prisma.request.findUnique({ where: { reference } });
    if (existing) return res.status(400).json({ error: 'Transaction already verified' });

    const { apiKey, secretKey, baseUrl } = await getMonnifyConfig();
    const accessToken = await getAccessToken(apiKey, secretKey, baseUrl);

    // Call Monnify query endpoint
    const response = await fetch(`${baseUrl}/api/v2/merchant/transactions/query?paymentReference=${encodeURIComponent(reference)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Monnify status query failed: ${errorText}`);
    }

    const data = await response.json();
    if (!data.requestSuccessful || !data.responseBody) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    const details = data.responseBody;
    const status = details.paymentStatus || details.status;

    if (status !== 'PAID') {
      return res.status(400).json({ error: `Payment not completed. Status: ${status}` });
    }

    const meta = details.metaData;
    if (!meta) {
      return res.status(400).json({ error: 'Verification metadata missing from transaction response' });
    }

    const request = await prisma.request.create({
      data: {
        subscriberId: meta.subscriberId === "" ? null : Number(meta.subscriberId),
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
    logger.error({ err: error }, 'Failed to verify Monnify payment');
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Transaction already verified' });
      }
    }
    res.status(500).json({ error: error.message });
  }
};
