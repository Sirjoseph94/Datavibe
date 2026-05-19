import crypto from 'crypto';
import logger from '../config/logger.js';

const ALGORITHM = 'aes-256-cbc';

// Generate a 32-byte key from standard environment keys
const getEncryptionKey = (): Buffer => {
  const secret = process.env.ENCRYPTION_KEY || process.env.JWT_SECRET || 'fallback-secure-encryption-key-32-chars-long';
  return crypto.createHash('sha256').update(secret).digest();
};

export function encrypt(text: string): string {
  if (!text) return '';
  try {
    const iv = crypto.randomBytes(16);
    const key = getEncryptionKey();
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    logger.error({ err: error }, 'Failed to encrypt sensitive data');
    return text;
  }
}

export function decrypt(encryptedText: string): string {
  if (!encryptedText) return '';
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 2) {
      // Not encrypted with our utility, return original text
      return encryptedText;
    }
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const key = getEncryptionKey();
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    // Graceful fallback to return original text if decryption fails
    return encryptedText;
  }
}

// Encrypt sensitive JSON keys within config
export function encryptConfig(configStr: string | null | undefined): string {
  if (!configStr) return '';
  try {
    const parsed = JSON.parse(configStr);
    let modified = false;

    const sensitiveFields = ['secretKey', 'apiKey'];
    for (const field of sensitiveFields) {
      if (parsed[field] && typeof parsed[field] === 'string' && !parsed[field].includes(':')) {
        parsed[field] = encrypt(parsed[field]);
        modified = true;
      }
    }

    return modified ? JSON.stringify(parsed) : configStr;
  } catch (e) {
    return configStr || '';
  }
}

// Decrypt sensitive JSON keys within config
export function decryptConfig(configStr: string | null | undefined): string {
  if (!configStr) return '';
  try {
    const parsed = JSON.parse(configStr);
    let modified = false;

    const sensitiveFields = ['secretKey', 'apiKey'];
    for (const field of sensitiveFields) {
      if (parsed[field] && typeof parsed[field] === 'string' && parsed[field].includes(':')) {
        parsed[field] = decrypt(parsed[field]);
        modified = true;
      }
    }

    return JSON.stringify(parsed);
  } catch (e) {
    return configStr || '';
  }
}
