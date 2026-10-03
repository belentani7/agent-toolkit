const assert = require('node:assert/strict');
const { simulateMonteCarlo, simulateScenarios } = require('../src/simulations');

const fixed = { base: 100, uncertainty: 12, threshold: 110, iterations: 4000, seed: 'prueba-local-01' };
const first = simulateMonteCarlo(fixed);
const second = simulateMonteCarlo(fixed);

assert.deepEqual(first, second, 'La misma semilla debe reproducir exactamente el cálculo.');
assert.equal(first.method, 'monte-carlo');
assert.equal(first.inputs.iterations, 4000);
assert.ok(first.metrics.p10 <= first.metrics.p50);
assert.ok(first.metrics.p50 <= first.metrics.p90);
assert.ok(first.metrics.probabilityAtOrAboveThreshold >= 0 && first.metrics.probabilityAtOrAboveThreshold <= 100);

const scenarios = simulateScenarios({
  baseline: 100,
  changes: [
    { label: 'Prudente', delta: -10 },
    { label: 'Medio', delta: 8 },
    { label: 'Ambicioso', delta: 25 }
  ]
});
assert.equal(scenarios.scenarios[0].value, 90);
assert.equal(scenarios.scenarios[1].value, 108);
assert.equal(scenarios.scenarios[2].value, 125);

assert.throws(() => simulateMonteCarlo({ base: 1, uncertainty: -1, threshold: 0, iterations: 100 }), /Incertidumbre/);
assert.throws(() => simulateScenarios({ baseline: 100, changes: [{ label: 'Inválido', delta: 101 }] }), /no es válido/);

console.log('Pruebas de simulación superadas.');
