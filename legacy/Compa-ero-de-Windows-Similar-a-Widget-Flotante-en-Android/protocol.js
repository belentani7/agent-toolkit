const { simulateMonteCarlo, simulateScenarios } = require('./simulations');

const PROTOCOL_VERSION = 1;

function check(id, label, passed, detail) {
  return { id, label, passed: Boolean(passed), detail };
}

function isFiniteTree(value) {
  if (typeof value === 'number') return Number.isFinite(value);
  if (Array.isArray(value)) return value.every(isFiniteTree);
  if (value && typeof value === 'object') return Object.values(value).every(isFiniteTree);
  return true;
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function executionInput(experiment) {
  if (experiment.method === 'monte-carlo') return { ...experiment.inputs, seed: experiment.seed };
  if (experiment.method === 'escenarios') {
    return {
      baseline: experiment.inputs.baseline,
      changes: experiment.scenarios.map((scenario) => ({ label: scenario.label, delta: scenario.delta }))
    };
  }
  throw new Error('Método no compatible con el protocolo.');
}

function replay(experiment, input = executionInput(experiment)) {
  if (experiment.method === 'monte-carlo') return simulateMonteCarlo(input);
  if (experiment.method === 'escenarios') return simulateScenarios(input);
  throw new Error('Método no compatible con el protocolo.');
}

function conceptualSampleCheck(experiment) {
  if (experiment.method === 'monte-carlo') {
    const passed = experiment.inputs.iterations >= 1000;
    return check('muestra-conceptual', 'Tamaño conceptual mínimo', passed, `${experiment.inputs.iterations} iteraciones; se requieren al menos 1.000.`);
  }
  const count = experiment.scenarios.length;
  return check('muestra-conceptual', 'Alternativas conceptuales mínimas', count >= 2, `${count} escenarios; se requieren al menos 2.`);
}

function coherenceCheck(experiment) {
  if (experiment.method === 'monte-carlo') {
    const metrics = experiment.metrics;
    const ordered = metrics.p10 <= metrics.p50 && metrics.p50 <= metrics.p90;
    const boundedProbability = metrics.probabilityAtOrAboveThreshold >= 0 && metrics.probabilityAtOrAboveThreshold <= 100;
    return check('coherencia', 'Coherencia de distribución', ordered && boundedProbability, ordered && boundedProbability ? 'Percentiles ordenados y probabilidad dentro de 0–100 %.' : 'Los percentiles o la probabilidad no son coherentes.');
  }
  const labels = experiment.scenarios.map((scenario) => scenario.label.trim().toLocaleLowerCase());
  const uniqueLabels = new Set(labels).size === labels.length;
  const differentiated = new Set(experiment.scenarios.map((scenario) => scenario.delta)).size >= 2;
  return check('coherencia', 'Coherencia de escenarios', uniqueLabels && differentiated, uniqueLabels && differentiated ? 'Etiquetas únicas y al menos dos variaciones distintas.' : 'Los escenarios se repiten o no permiten comparación.');
}

function perturbationCheck(experiment) {
  if (experiment.method === 'monte-carlo') {
    const changedInput = executionInput(experiment);
    changedInput.uncertainty = changedInput.uncertainty === 0 ? 0.05 : changedInput.uncertainty * 1.05;
    const perturbed = replay(experiment, changedInput);
    const displacement = Math.abs(perturbed.metrics.p50 - experiment.metrics.p50);
    const tolerance = Math.max(1, Math.abs(experiment.inputs.base) * 0.05);
    return check('perturbacion', 'Resistencia a perturbación local del 5 %', displacement <= tolerance, `Cambio de p50: ${displacement.toFixed(3)}; tolerancia del modelo: ${tolerance.toFixed(3)}.`);
  }
  const changedInput = executionInput(experiment);
  changedInput.baseline *= 1.05;
  const perturbed = replay(experiment, changedInput);
  const drifts = perturbed.scenarios.map((scenario, index) => {
    const baseValue = experiment.scenarios[index].value;
    return baseValue === 0 ? Math.abs(scenario.value) : Math.abs((scenario.value - baseValue) / baseValue);
  });
  const worst = Math.max(...drifts);
  return check('perturbacion', 'Resistencia a perturbación local del 5 %', worst <= 0.06, `Variación relativa máxima: ${(worst * 100).toFixed(2)} %; tolerancia del modelo: 6,00 %.`);
}

function evaluateConceptualProtocol(experiment) {
  const checks = [];
  try {
    const input = executionInput(experiment);
    checks.push(check('entradas', 'Entradas válidas', isFiniteTree(input), 'Las entradas son números finitos dentro del método declarado.'));

    const firstReplay = replay(experiment, input);
    const secondReplay = replay(experiment, input);
    checks.push(check('reproducibilidad', 'Reproducibilidad', sameJson(firstReplay, secondReplay), 'Se volvió a ejecutar el mismo método con los mismos parámetros y semilla.'));
    checks.push(check('salida-finita', 'Salida finita', isFiniteTree(firstReplay.metrics) && isFiniteTree(firstReplay.series || firstReplay.scenarios), 'Las métricas y resultados calculados no contienen NaN ni infinito.'));
    checks.push(conceptualSampleCheck(experiment));
    checks.push(coherenceCheck(experiment));
    checks.push(perturbationCheck(experiment));
  } catch (error) {
    checks.push(check('protocolo-ejecutable', 'Protocolo ejecutable', false, error.message));
  }

  const passed = checks.filter((item) => item.passed).length;
  const criticalFailure = checks.some((item) => !item.passed && ['entradas', 'reproducibilidad', 'salida-finita', 'protocolo-ejecutable'].includes(item.id));
  const status = passed === checks.length ? 'estable-en-el-modelo' : (criticalFailure ? 'no-evaluable' : 'fragil-en-el-modelo');

  return {
    version: PROTOCOL_VERSION,
    evaluatedAt: new Date().toISOString(),
    status,
    passed,
    total: checks.length,
    checks,
    limitations: [
      'Resultado sintético: no demuestra comportamiento real.',
      'La estabilidad solo aplica a los parámetros y al modelo declarado.',
      'Toda validación fuera del modelo requiere revisión humana y un piloto separado.'
    ]
  };
}

module.exports = { PROTOCOL_VERSION, evaluateConceptualProtocol };
