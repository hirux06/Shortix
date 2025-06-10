import { customAlphabet } from "nanoid";
import crypto from 'crypto'

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_.';

export const generateShortId = customAlphabet(alphabet, 5);

export const hashLongUrl = (url: string) => {
  return crypto.createHash('sha256').update(url).digest('hex');
}

export const SHORT_URL_PREFIX = 'short:';
export const LONG_URL_PREFIX = 'long:';