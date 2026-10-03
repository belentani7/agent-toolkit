const crypto = require('node:crypto');

function numeric(value, label, min = -Infinity, max = Infinity) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < min || n > max) throw new Error(`${label} no es válido.`);
  return n;
}

function seededRandom(seedText) {
  let state = 2166136261;
  for (const char of String(seedText)) {
    state ^= char.charCodeAt(0);
    state = Math.imul(state, 16777619);
  }
  return () => {
    state += 0x6D2B79F5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function percentile(sorted, p) {
  const index = (sorted.length - 1) * p;
  const low = Math.floor(index);
  const high = Math.ceil(index);
  return sorted[low] + (sorted[high] - sorted[low]) * (index - low);
}

function normal(random) {
  const u1 = Math.max(random(), Number.MIN_VALUE);
  const u2 = random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function simulateMonteCarlo(params) {
  const base = numeric(params.base, 'Valor base', -1e9, 1e9);
  const uncertainty = numeric(params.uncertainty, 'Incertidumbre', 0, 1e9);
  const iterations = Math.round(numeric(params.iterations, 'Iteraciones', 100, 50000));
  const threshold = numeric(params.threshold, 'Umbral', -1e9, 1e9);
  const seed = String(params.seed || crypto.randomUUID());
  const random = seededRandom(seed);
  const observations = Array.from({ length: iterations }, () => base + normal(random) * uncertainty).sort((a, b) => a - b);
  const mean = observations.reduce((total, value) => total + value, 0) / iterations;
  const above = observations.filter((value) => value >= threshold).length / iterations;
  return {
    method: 'monte-carlo',
    seed,
    inputs: { base, uncertainty, iterations, threshold },
    metrics: {
      mean: Number(mean.toFixed(3)),
      p10: Number(percentile(observations, 0.1).toFixed(3)),
      p50: Number(percentile(observations, 0.5).toFixed(3)),
      p90: Number(percentile(observations, 0.9).toFixed(3)),
      probabilityAtOrAboveThreshold: Number((above * 100).toFixed(1))
    },
    series: observations.filter((_, index) => index % Math.max(1, Math.floor(iterations / 24)) === 0).slice(0, 24)
  };
}

function simulateScenarios(params) {
  const baseline = numeric(params.baseline, 'Línea base', -1e9, 1e9);
  const changes = Array.isArray(params.changes) ? params.changes.slice(0, 6) : [];
  if (changes.length === 0) throw new Error('Se requiere al menos un escenario.');
  const scenarios = changes.map((change, index) => {
    const label = String(change.label || `Escenario ${index + 1}`).slice(0, 60);
    const delta = numeric(change.delta, `Variación de ${label}`, -100, 100);
    const value = baseline * (1 + delta / 100);
    return { label, delta, value: Number(value.toFixed(3)) };
  });
  return { method: 'escenarios', inputs: { baseline }, metrics: { baseline }, scenarios };
}

module.exports = { simulateMonteCarlo, simulateScenarios };
