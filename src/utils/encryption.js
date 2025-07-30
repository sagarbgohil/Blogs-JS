import crypto from 'crypto';
import env from '../config/environment.js';

export const decryptText = (encryptedBase64) => {
    const key = Buffer.from(env.api.secret, 'hex'); // 32 bytes = 256 bits
    if (key.length !== 32) {
        throw new Error('AES key must be 256 bits (32 bytes)');
    }
    const encryptedBuffer = Buffer.from(encryptedBase64, 'base64');

    const iv = encryptedBuffer.slice(0, 12); // 12-byte IV
    const authTag = encryptedBuffer.slice(encryptedBuffer.length - 16); // last
    const data = encryptedBuffer.slice(12, encryptedBuffer.length - 16); // actual ciphertext

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag); // 🔐 required in GCM

    let decrypted = decipher.update(data);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString('utf-8');
};
