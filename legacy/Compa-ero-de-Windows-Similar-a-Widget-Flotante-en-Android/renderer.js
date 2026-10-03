const appRoot = document.getElementById('app');
const isWidget = new URLSearchParams(window.location.search).has('widget');
let vault;
let selectedTopicId;
let activeView = 'notas';

const fmtDate = new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' });
const fmtNumber = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 });

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function currentTopic() {
  return vault.topics.find((topic) => topic.id === selectedTopicId) || vault.topics[0];
}

function itemsFor(collection) {
  return vault[collection].filter((item) => item.topicId === selectedTopicId);
}

function notice(message, kind = 'neutral') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const element = document.createElement('div');
  element.className = `toast ${kind}`;
  element.textContent = message;
  document.body.appendChild(element);
  window.setTimeout(() => element.remove(), 3400);
}

async function refresh(nextVault) {
  vault = nextVault || await window.acompanante.load();
  selectedTopicId = vault.topics.some((topic) => topic.id === selectedTopicId) ? selectedTopicId : vault.topics[0]?.id;
  render();
}

function renderWidget() {
  const topic = currentTopic();
  const recent = itemsFor('notes')[0];
  appRoot.innerHTML = `
    <section class="widget-shell">
      <header class="widget-header">
        <button class="drag-region widget-mark" aria-label="Mover widget">∷</button>
        <div><span class="eyebrow">LOCAL · CIFRADO</span><strong>${escapeHtml(topic?.name || 'Sin tema')}</strong></div>
        <button class="icon-button" data-action="open-main" title="Abrir investigación" aria-label="Abrir investigación">↗</button>
      </header>
      <form id="quick-note-form" class="widget-capture">
        <textarea name="quickNote" maxlength="10000" placeholder="Anota una señal, idea o duda…" aria-label="Nota rápida"></textarea>
        <button class="compact-primary" type="submit">Guardar</button>
      </form>
      <footer class="widget-footer">
        <span>${recent ? `Última nota · ${fmtDate.format(new Date(recent.createdAt))}` : 'Sin notas todavía'}</span>
        <button data-action="open-main" class="text-button">Ver laboratorio</button>
      </footer>
    </section>`;
}

function renderTopicItem(topic) {
  const count = vault.notes.filter((note) => note.topicId === topic.id).length;
  return `<button class="topic-item ${topic.id === selectedTopicId ? 'selected' : ''}" data-topic="${topic.id}">
    <i style="background:${escapeHtml(topic.color)}"></i>
    <span>${escapeHtml(topic.name)}</span><em>${count}</em>
  </button>`;
}

function renderNotes() {
  const notes = itemsFor('notes');
  if (!notes.length) return `<div class="empty-state"><strong>Aquí empiezan las señales.</strong><span>Captura una idea breve o una observación que quieras explorar.</span></div>`;
  return `<div class="stack">${notes.map((note) => `<article class="record-card"><div class="record-meta"><span>NOTA</span><time>${fmtDate.format(new Date(note.createdAt))}</time></div><p>${escapeHtml(note.text)}</p></article>`).join('')}</div>`;
}

function renderHypotheses() {
  const hypotheses = itemsFor('hypotheses');
  return `
    <form id="hypothesis-form" class="form-card inline-form">
      <div><span class="field-label">HIPÓTESIS</span><input required name="hypothesis" maxlength="1000" placeholder="Si…, entonces… porque…" /></div>
      <div class="compact-field"><span class="field-label">VARIABLE OBJETIVO</span><input required name="target" maxlength="80" value="resultado" /></div>
      <button class="primary" type="submit">Añadir</button>
    </form>
    ${hypotheses.length ? `<div class="stack">${hypotheses.map((hypothesis) => `<article class="record-card hypothesis-card"><div class="record-meta"><span>HIPÓTESIS</span><time>${fmtDate.format(new Date(hypothesis.createdAt))}</time></div><p>${escapeHtml(hypothesis.text)}</p><span class="target-pill">Objetivo: ${escapeHtml(hypothesis.target)}</span></article>`).join('')}</div>` : `<div class="empty-state"><strong>Formula una relación comprobable.</strong><span>El experimento usará únicamente parámetros sintéticos que tú elijas.</span></div>`}`;
}

function renderExperimentForm() {
  return `
    <section class="simulation-intro"><div><span class="eyebrow">ENTORNO SINTÉTICO</span><h3>Prueba supuestos, no realidad.</h3><p>Las salidas son matemáticas y reproducibles. No conectan con internet, archivos ni sistemas externos.</p></div><span class="synthetic-badge">SIN DATOS REALES</span></section>
    <div class="method-switch" role="tablist"><button class="method-button selected" data-method="monte-carlo" role="tab">Incertidumbre</button><button class="method-button" data-method="escenarios" role="tab">Escenarios</button></div>
    <form id="experiment-form" class="form-card experiment-form" data-method="monte-carlo">
      <input type="hidden" name="method" value="monte-carlo" />
      <div class="experiment-fields monte-carlo-fields">
        <label><span>Valor base</span><input required type="number" name="base" value="100" step="any" /></label>
        <label><span>Incertidumbre (desv. típica)</span><input required type="number" name="uncertainty" value="12" min="0" step="any" /></label>
        <label><span>Umbral</span><input required type="number" name="threshold" value="110" step="any" /></label>
        <label><span>Iteraciones</span><input required type="number" name="iterations" value="4000" min="100" max="50000" step="100" /></label>
      </div>
      <div class="experiment-fields scenario-fields hidden">
        <label><span>Línea base</span><input required type="number" name="baseline" value="100" step="any" /></label>
        <label><span>Escenario prudente (%)</span><input required type="number" name="cautious" value="-10" step="any" /></label>
        <label><span>Escenario medio (%)</span><input required type="number" name="expected" value="8" step="any" /></label>
        <label><span>Escenario ambicioso (%)</span><input required type="number" name="ambitious" value="25" step="any" /></label>
      </div>
      <div class="form-bottom"><p>Se guardará semilla local para repetir el cálculo.</p><button class="primary" type="submit">Ejecutar simulación</button></div>
    </form>`;
}

function renderProtocol(protocol) {
  if (!protocol) return `<section class="protocol-card pending"><div><span class="eyebrow">PROTOCOLO CONCEPTUAL</span><strong>Evaluación pendiente</strong></div><span>Este registro es anterior al protocolo.</span></section>`;
  const labels = {
    'estable-en-el-modelo': 'Estable en el modelo',
    'fragil-en-el-modelo': 'Frágil en el modelo',
    'no-evaluable': 'No evaluable'
  };
  const stateClass = protocol.status === 'estable-en-el-modelo' ? 'stable' : (protocol.status === 'fragil-en-el-modelo' ? 'fragile' : 'unevaluable');
  return `<section class="protocol-card ${stateClass}"><div class="protocol-summary"><div><span class="eyebrow">PROTOCOLO CONCEPTUAL</span><strong>${labels[protocol.status] || 'Pendiente'}</strong></div><span class="protocol-score">${protocol.passed}/${protocol.total} comprobaciones</span></div><p>Prueba la coherencia del modelo, no la realidad.</p><details><summary>Ver comprobaciones y límites</summary><ul>${protocol.checks.map((item) => `<li class="${item.passed ? 'pass' : 'fail'}"><b>${item.passed ? '✓' : '×'}</b><span><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.detail)}</small></span></li>`).join('')}</ul><div class="protocol-limitations">${protocol.limitations.map((limit) => `<span>${escapeHtml(limit)}</span>`).join('')}</div></details></section>`;
}

function renderExperimentResult(experiment) {
  if (experiment.method === 'monte-carlo') {
    const metrics = experiment.metrics;
    return `<article class="experiment-card"><div class="record-meta"><span>MONTE CARLO · SINTÉTICO</span><time>${fmtDate.format(new Date(experiment.createdAt))}</time></div><div class="metric-grid"><div><span>Media</span><strong>${fmtNumber.format(metrics.mean)}</strong></div><div><span>P10–P90</span><strong>${fmtNumber.format(metrics.p10)}–${fmtNumber.format(metrics.p90)}</strong></div><div><span>≥ umbral</span><strong>${fmtNumber.format(metrics.probabilityAtOrAboveThreshold)} %</strong></div></div><p class="limited-result">Resultado sintético: no demuestra comportamiento real ni sirve como decisión final.</p>${renderProtocol(experiment.protocol)}<details><summary>Supuestos y reproducibilidad</summary><p>Base ${fmtNumber.format(experiment.inputs.base)} · Incertidumbre ${fmtNumber.format(experiment.inputs.uncertainty)} · ${experiment.inputs.iterations} iteraciones · Semilla ${escapeHtml(experiment.seed)}</p></details></article>`;
  }
  return `<article class="experiment-card"><div class="record-meta"><span>ESCENARIOS · SINTÉTICO</span><time>${fmtDate.format(new Date(experiment.createdAt))}</time></div><div class="scenario-list"><div class="scenario baseline"><span>Línea base</span><strong>${fmtNumber.format(experiment.metrics.baseline)}</strong></div>${experiment.scenarios.map((scenario) => `<div class="scenario"><span>${escapeHtml(scenario.label)} <em>${scenario.delta > 0 ? '+' : ''}${fmtNumber.format(scenario.delta)} %</em></span><strong>${fmtNumber.format(scenario.value)}</strong></div>`).join('')}</div><p class="limited-result">Resultado sintético: no demuestra comportamiento real ni sirve como decisión final.</p>${renderProtocol(experiment.protocol)}</article>`;
}

function renderExperiments() {
  const experiments = itemsFor('experiments');
  return `${renderExperimentForm()}<div class="results-title"><span class="eyebrow">REGISTRO</span><h3>Resultados de simulación</h3></div>${experiments.length ? `<div class="stack">${experiments.map(renderExperimentResult).join('')}</div>` : `<div class="empty-state compact"><strong>Aún no hay simulaciones.</strong><span>Elige parámetros sintéticos y ejecuta el primer modelo.</span></div>`}`;
}

function renderProposals() {
  const proposals = itemsFor('proposals');
  return `
    <section class="scale-intro"><span class="eyebrow">PUENTE A LA REALIDAD</span><h3>Diseña una validación; no la ejecutes desde aquí.</h3><p>Convierte el aprendizaje sintético en un borrador de piloto con métricas, límites y condiciones de salida.</p></section>
    <form id="proposal-form" class="form-card"><label><span class="field-label">PROPUESTA DE ESCALA</span><textarea name="proposal" required maxlength="5000" placeholder="Objetivo, supuesto a validar con datos reales, diseño de piloto, métrica, umbral de salida, riesgo y responsable…"></textarea></label><div class="form-bottom"><p>Queda como borrador local. No inicia ningún proceso.</p><button class="primary" type="submit">Guardar propuesta</button></div></form>
    ${proposals.length ? `<div class="stack">${proposals.map((proposal) => `<article class="record-card"><div class="record-meta"><span>PROPUESTA · BORRADOR</span><time>${fmtDate.format(new Date(proposal.createdAt))}</time></div><p>${escapeHtml(proposal.text)}</p></article>`).join('')}</div>` : ''}`;
}

function renderActivePanel() {
  if (activeView === 'notas') return renderNotes();
  if (activeView === 'hipotesis') return renderHypotheses();
  if (activeView === 'experimentos') return renderExperiments();
  return renderProposals();
}

function renderMain() {
  const topic = currentTopic();
  const notes = itemsFor('notes');
  appRoot.innerHTML = `
    <aside class="sidebar">
      <div class="brand"><span class="brand-orb"></span><span>Acompañante</span></div>
      <div class="side-top"><span class="eyebrow">LABORATORIOS</span><button class="add-topic" data-action="new-topic" aria-label="Crear tema">＋</button></div>
      <nav class="topic-list" aria-label="Temas">${vault.topics.filter((topicItem) => !topicItem.archived).map(renderTopicItem).join('')}</nav>
      <div class="side-bottom"><button class="side-link" data-action="toggle-widget">◌ <span>Widget flotante</span></button><button class="side-link disabled" title="Sincronización desactivada por seguridad">⌁ <span>Solo local</span></button></div>
    </aside>
    <section class="workspace">
      <header class="topbar"><div><span class="eyebrow">${escapeHtml(topic?.name || 'SIN TEMA')} · ${notes.length} NOTAS</span><h1>Investiga con calma.<br /><em>Prueba en pequeño.</em></h1></div><div class="privacy-lock"><b>◒</b><span>Cifrado local<br /><small>sin red por defecto</small></span></div></header>
      <section class="capture-card"><div class="capture-copy"><span class="eyebrow">CAPTURA</span><h2>¿Qué señal merece atención?</h2><p>Una nota no es una conclusión. Es material para pensar.</p></div><form id="note-form"><textarea name="note" required maxlength="10000" placeholder="Escribe una observación, duda o idea…"></textarea><div class="capture-actions"><span>Se guarda en este equipo.</span><button class="primary" type="submit">Guardar nota</button></div></form></section>
      <section class="depth-section"><div class="depth-heading"><div><span class="eyebrow">PROFUNDIZA</span><h2>Del apunte a una decisión consciente.</h2></div><p>Todo paso es manual, visible y reversible.</p></div><nav class="stage-nav" aria-label="Etapas">${[
        ['notas', '01', 'Notas'], ['hipotesis', '02', 'Hipótesis'], ['experimentos', '03', 'Simulación'], ['propuestas', '04', 'Propuesta']
      ].map(([key, number, label]) => `<button class="stage ${activeView === key ? 'active' : ''}" data-view="${key}"><span>${number}</span>${label}</button>`).join('')}</nav>
      <section class="content-panel">${renderActivePanel()}</section>
      </section>
    </section>`;
}

function render() {
  if (isWidget) renderWidget();
  else renderMain();
}

function switchMethod(method) {
  const form = document.getElementById('experiment-form');
  if (!form) return;
  form.dataset.method = method;
  form.elements.method.value = method;
  document.querySelectorAll('.method-button').forEach((button) => button.classList.toggle('selected', button.dataset.method === method));
  document.querySelector('.monte-carlo-fields').classList.toggle('hidden', method !== 'monte-carlo');
  document.querySelector('.scenario-fields').classList.toggle('hidden', method !== 'escenarios');
}

document.addEventListener('click', async (event) => {
  const topicButton = event.target.closest('[data-topic]');
  if (topicButton) { selectedTopicId = topicButton.dataset.topic; render(); return; }
  const viewButton = event.target.closest('[data-view]');
  if (viewButton) { activeView = viewButton.dataset.view; render(); return; }
  const methodButton = event.target.closest('[data-method]');
  if (methodButton) { switchMethod(methodButton.dataset.method); return; }
  const actionButton = event.target.closest('[data-action]');
  if (!actionButton) return;
  if (actionButton.dataset.action === 'open-main') await window.acompanante.openMain();
  if (actionButton.dataset.action === 'toggle-widget') await window.acompanante.toggleWidget();
  if (actionButton.dataset.action === 'new-topic') {
    const name = window.prompt('Nombre del nuevo tema');
    if (!name) return;
    try { await refresh(await window.acompanante.createTopic(name)); notice('Tema creado.', 'success'); } catch (error) { notice(error.message, 'error'); }
  }
});

document.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.target;
  try {
    if (form.id === 'quick-note-form') {
      const text = form.elements.quickNote.value;
      await refresh(await window.acompanante.createNote({ topicId: selectedTopicId, text }));
      notice('Nota cifrada y guardada.', 'success');
    }
    if (form.id === 'note-form') {
      const text = form.elements.note.value;
      await refresh(await window.acompanante.createNote({ topicId: selectedTopicId, text }));
      notice('Nota guardada localmente.', 'success');
    }
    if (form.id === 'hypothesis-form') {
      await refresh(await window.acompanante.createHypothesis({ topicId: selectedTopicId, text: form.elements.hypothesis.value, target: form.elements.target.value }));
      notice('Hipótesis añadida.', 'success');
    }
    if (form.id === 'experiment-form') {
      const method = form.elements.method.value;
      const params = method === 'monte-carlo'
        ? { base: form.elements.base.value, uncertainty: form.elements.uncertainty.value, threshold: form.elements.threshold.value, iterations: form.elements.iterations.value }
        : { baseline: form.elements.baseline.value, changes: [
          { label: 'Prudente', delta: form.elements.cautious.value }, { label: 'Medio', delta: form.elements.expected.value }, { label: 'Ambicioso', delta: form.elements.ambitious.value }
        ] };
      await window.acompanante.runExperiment({ topicId: selectedTopicId, method, params });
      await refresh();
      notice('Simulación sintética registrada.', 'success');
    }
    if (form.id === 'proposal-form') {
      await refresh(await window.acompanante.createProposal({ topicId: selectedTopicId, text: form.elements.proposal.value }));
      notice('Propuesta guardada como borrador local.', 'success');
    }
  } catch (error) {
    notice(error.message || 'No se pudo completar la operación.', 'error');
  }
});

refresh().catch((error) => {
  appRoot.innerHTML = `<section class="fatal"><h1>No se pudo abrir la bóveda.</h1><p>${escapeHtml(error.message)}</p></section>`;
});
