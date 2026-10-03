const crypto = require('node:crypto');

const VAULT_VERSION = 1;

function encryptPayload(key, value) {
  if (!Buffer.isBuffer(key) || key.length !== 32) throw new Error('Clave de bóveda no válida.');
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(value), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return JSON.stringify({
    version: VAULT_VERSION,
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    data: encrypted.toString('base64')
  });
}

function decryptPayload(key, envelopeText) {
  if (!Buffer.isBuffer(key) || key.length !== 32) throw new Error('Clave de bóveda no válida.');
  const envelope = JSON.parse(envelopeText);
  if (envelope.version !== VAULT_VERSION) throw new Error('Versión de bóveda no compatible.');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(envelope.iv, 'base64'));
  decipher.setAuthTag(Buffer.from(envelope.tag, 'base64'));
  const plain = Buffer.concat([
    decipher.update(Buffer.from(envelope.data, 'base64')),
    decipher.final()
  ]).toString('utf8');
  return JSON.parse(plain);
}

module.exports = { VAULT_VERSION, encryptPayload, decryptPayload };
