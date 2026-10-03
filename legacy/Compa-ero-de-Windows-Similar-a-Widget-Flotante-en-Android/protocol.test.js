const assert = require('node:assert/strict');
const { simulateMonteCarlo, simulateScenarios } = require('../src/simulations');
const { evaluateConceptualProtocol } = require('../src/protocol');

const monteCarlo = simulateMonteCarlo({ base: 100, uncertainty: 12, threshold: 110, iterations: 4000, seed: 'protocolo-estable' });
const stable = evaluateConceptualProtocol(monteCarlo);
assert.equal(stable.status, 'estable-en-el-modelo');
assert.equal(stable.passed, stable.total);
assert.equal(stable.checks.length, 6);
assert.ok(stable.checks.every((item) => item.passed));

const sparse = simulateMonteCarlo({ base: 100, uncertainty: 12, threshold: 110, iterations: 500, seed: 'protocolo-fragil' });
const fragile = evaluateConceptualProtocol(sparse);
assert.equal(fragile.status, 'fragil-en-el-modelo');
assert.ok(fragile.checks.some((item) => item.id === 'muestra-conceptual' && !item.passed));

const sensitive = simulateMonteCarlo({ base: 0, uncertainty: 1000000, threshold: 0, iterations: 4000, seed: 'protocolo-sensible' });
const sensitiveResult = evaluateConceptualProtocol(sensitive);
assert.equal(sensitiveResult.status, 'fragil-en-el-modelo');
assert.ok(sensitiveResult.checks.some((item) => item.id === 'perturbacion' && !item.passed));

const scenarios = simulateScenarios({ baseline: 100, changes: [{ label: 'Prudente', delta: -10 }, { label: 'Medio', delta: 8 }, { label: 'Ambicioso', delta: 25 }] });
const stableScenarios = evaluateConceptualProtocol(scenarios);
assert.equal(stableScenarios.status, 'estable-en-el-modelo');

const invalid = { method: 'monte-carlo', seed: 'invalido', inputs: { base: 'no-numero', uncertainty: 2, threshold: 1, iterations: 4000 }, metrics: {} };
const unevaluable = evaluateConceptualProtocol(invalid);
assert.equal(unevaluable.status, 'no-evaluable');
assert.ok(unevaluable.checks.some((item) => !item.passed));

console.log('Pruebas de protocolo conceptual superadas.');
