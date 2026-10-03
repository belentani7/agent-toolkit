const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { encryptPayload, decryptPayload } = require('../src/vault-crypto');

const key = crypto.randomBytes(32);
const value = {
  topics: [{ id: 'topic_1', name: 'Investigación sintética' }],
  notes: [{ text: 'Dato local y confidencial.' }],
  experiments: [{ id: 'exp_1', protocol: { status: 'estable-en-el-modelo', checks: [{ id: 'reproducibilidad', passed: true }] } }]
};
const encrypted = encryptPayload(key, value);

assert.notEqual(encrypted, JSON.stringify(value), 'El contenido no debe persistir en texto claro.');
assert.deepEqual(decryptPayload(key, encrypted), value, 'La bóveda debe recuperar el mismo contenido.');
assert.throws(() => decryptPayload(crypto.randomBytes(32), encrypted), /Unsupported state|authenticate|auth|unable/i, 'Una clave ajena no debe abrir la bóveda.');

const tampered = JSON.parse(encrypted);
tampered.data = tampered.data.slice(0, -2) + 'aa';
assert.throws(() => decryptPayload(key, JSON.stringify(tampered)), /Unsupported state|authenticate|auth|unable/i, 'Una alteración debe detectarse.');

console.log('Pruebas de cifrado superadas.');
