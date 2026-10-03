(() => {
  const topic = { id: 'topic_preview', name: 'Optimización de flujos', color: '#8f7cf5', createdAt: '2026-08-26T00:00:00.000Z', archived: false };
  const vault = {
    version: 1,
    topics: [topic, { id: 'topic_other', name: 'Modelo energético', color: '#48a984', createdAt: '2026-08-26T00:00:00.000Z', archived: false }],
    notes: [{ id: 'note_preview', topicId: topic.id, text: 'Señal inicial: el rendimiento teórico cambia más por variación de demanda que por ajustes mínimos de capacidad.', tags: [], createdAt: '2026-08-26T00:00:00.000Z' }],
    hypotheses: [{ id: 'hyp_preview', topicId: topic.id, text: 'Si la capacidad media supera la demanda sintética con holgura, el tiempo de espera modelado disminuye.', target: 'tiempo de espera', createdAt: '2026-08-26T00:00:00.000Z' }],
    experiments: [{ id: 'exp_preview', topicId: topic.id, createdAt: '2026-08-26T00:00:00.000Z', method: 'monte-carlo', seed: 'vista-previa', inputs: { base: 100, uncertainty: 12, iterations: 4000, threshold: 110 }, metrics: { mean: 100.3, p10: 84.6, p50: 100.2, p90: 115.7, probabilityAtOrAboveThreshold: 20.8 }, series: [], protocol: { version: 1, evaluatedAt: '2026-08-26T00:00:00.000Z', status: 'estable-en-el-modelo', passed: 6, total: 6, checks: [{ id: 'entradas', label: 'Entradas válidas', passed: true, detail: 'Las entradas son números finitos dentro del método declarado.' }, { id: 'reproducibilidad', label: 'Reproducibilidad', passed: true, detail: 'La misma semilla devuelve las mismas métricas.' }, { id: 'salida-finita', label: 'Salida finita', passed: true, detail: 'No hay NaN ni infinito.' }, { id: 'muestra-conceptual', label: 'Tamaño conceptual mínimo', passed: true, detail: '4.000 iteraciones; se requieren al menos 1.000.' }, { id: 'coherencia', label: 'Coherencia de distribución', passed: true, detail: 'Percentiles ordenados y probabilidad dentro de 0–100 %.' }, { id: 'perturbacion', label: 'Resistencia a perturbación local del 5 %', passed: true, detail: 'El cambio de salida queda dentro de la tolerancia del modelo.' }], limitations: ['Resultado sintético: no demuestra comportamiento real.', 'La estabilidad solo aplica a los parámetros y al modelo declarado.', 'Toda validación fuera del modelo requiere revisión humana y un piloto separado.'] } }],
    proposals: [{ id: 'proposal_preview', topicId: topic.id, text: 'Borrador: validar el modelo con un piloto aislado, métricas definidas, revisión humana y criterio de salida antes de cualquier despliegue.', createdAt: '2026-08-26T00:00:00.000Z', status: 'borrador' }]
  };
  const clone = () => structuredClone(vault);
  window.acompanante = {
    load: async () => clone(),
    openMain: async () => {},
    toggleWidget: async () => {},
    createTopic: async (name) => { vault.topics.push({ id: crypto.randomUUID(), name, color: '#8f7cf5', createdAt: new Date().toISOString(), archived: false }); return clone(); },
    createNote: async ({ topicId, text }) => { vault.notes.unshift({ id: crypto.randomUUID(), topicId, text, tags: [], createdAt: new Date().toISOString() }); return clone(); },
    createHypothesis: async ({ topicId, text, target }) => { vault.hypotheses.unshift({ id: crypto.randomUUID(), topicId, text, target, createdAt: new Date().toISOString() }); return clone(); },
    runExperiment: async () => ({ id: crypto.randomUUID(), topicId: topic.id, createdAt: new Date().toISOString(), method: 'monte-carlo', seed: 'vista-previa', inputs: { base: 100, uncertainty: 12, iterations: 4000, threshold: 110 }, metrics: { mean: 100.3, p10: 84.6, p50: 100.2, p90: 115.7, probabilityAtOrAboveThreshold: 20.8 } }),
    createProposal: async ({ topicId, text }) => { vault.proposals.unshift({ id: crypto.randomUUID(), topicId, text, createdAt: new Date().toISOString(), status: 'borrador' }); return clone(); }
  };
})();
