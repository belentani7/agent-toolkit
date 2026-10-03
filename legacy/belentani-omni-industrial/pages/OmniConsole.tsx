import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Bot, CheckCircle2, CircleStop, Gauge, HeartPulse, Lock, Play, RotateCcw, Shield, Trash2, Zap } from 'lucide-react';
import { useOmni } from '../contexts/OmniContext';
import OmniMemoryPanel from '../components/OmniMemoryPanel';
import OmniInteroperabilityPanel from '../components/OmniInteroperabilityPanel';
import OmniCommandPalette from '../components/OmniCommandPalette';
import OmniDiagnosticsPanel from '../components/OmniDiagnosticsPanel';
import OmniTelemetryPanel from '../components/OmniTelemetryPanel';

const capabilityCards = [
  { kind: 'playlist_synthesis' as const, label: 'Síntesis musical', description: 'Prepara una generación con restricciones explícitas.' },
  { kind: 'explain_decision' as const, label: 'Explicar decisión', description: 'Genera una explicación legible de una selección.' },
  { kind: 'privacy_audit' as const, label: 'Auditoría de privacidad', description: 'Comprueba almacenamiento y efectos externos.' },
  { kind: 'queue_optimization' as const, label: 'Optimizar cola', description: 'Ordena tareas por prioridad y coherencia.' },
  { kind: 'health_check' as const, label: 'Comprobación de salud', description: 'Verifica que el runtime local responde.' },
];

const statusLabel: Record<string, string> = {
  queued: 'En cola',
  running: 'Ejecutando',
  completed: 'Completada',
  failed: 'Fallida',
  cancelled: 'Cancelada',
};

const OmniConsole: React.FC = () => {
  const {
    snapshot,
    enqueue,
    cancel,
    setEnabled,
    setSafeMode,
    emergencyStop,
    resumeAfterStop,
    clearHistory,
  } = useOmni();
  const [notice, setNotice] = useState('Runtime local preparado.');
  const queuedTasks = useMemo(() => snapshot.queue.filter((task) => task.status === 'queued' || task.status === 'running').length, [snapshot.queue]);

  const runCapability = (kind: typeof capabilityCards[number]['kind']) => {
    let taskId: string | null = null;
    switch (kind) {
      case 'playlist_synthesis':
        taskId = enqueue('playlist_synthesis', {
          prompt: 'Una sesión nocturna, cinematográfica y progresiva',
          constraints: { diversity: 'high', explicitApproval: true },
        }, 3);
        break;
      case 'explain_decision':
        taskId = enqueue('explain_decision', {
          prompt: 'Una sesión nocturna, cinematográfica y progresiva',
        }, 3);
        break;
      case 'privacy_audit':
        taskId = enqueue('privacy_audit', { source: 'omni-console' }, 4);
        break;
      case 'queue_optimization':
        taskId = enqueue('queue_optimization', { items: ['ambient', 'downtempo', 'electronica'] }, 3);
        break;
      case 'health_check':
        taskId = enqueue('health_check', { source: 'omni-console' }, 5);
        break;
    }
    setNotice(taskId ? `Tarea ${taskId.slice(-8)} añadida.` : 'La tarea no se añadió: revisa el estado del runtime.');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 py-8">
      <section className="glass neon-border rounded-3xl p-6 sm:p-8 space-y-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-3">
              <Bot className="w-8 h-8 text-amber-400" aria-hidden="true" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-amber-400 font-mono">BELENTANI OMNI</p>
                <h1 className="text-3xl sm:text-4xl font-black text-white">Consola de autonomía máxima</h1>
              </div>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              Un runtime local, observable y reversible. Puede preparar tareas, vigilar su cola y detenerse en cualquier momento; no realiza pagos, publicaciones ni acciones externas sin una capacidad explícita y una confirmación posterior.
            </p>
          </div>
            <div className="flex flex-wrap items-center gap-2">
              <OmniCommandPalette onNotice={setNotice} />
              <div className="flex items-center gap-2 text-xs font-mono text-amber-300 glass rounded-full px-4 py-2 w-fit">
                <HeartPulse className="w-4 h-4" aria-hidden="true" />
                {snapshot.enabled ? 'ACTIVO' : 'PAUSADO'} · v{snapshot.version}
              </div>
            </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Tareas activas', value: queuedTasks, icon: Activity },
            { label: 'Completadas', value: snapshot.completed, icon: CheckCircle2 },
            { label: 'Fallidas', value: snapshot.failed, icon: Gauge },
            { label: 'Heartbeat', value: new Date(snapshot.lastHeartbeat).toLocaleTimeString(), icon: Zap },
          ].map((metric) => {
            const Icon = metric.icon;
            return <div key={metric.label} className="glass rounded-2xl p-4 space-y-2">
              <Icon className="w-5 h-5 text-amber-400" aria-hidden="true" />
              <p className="text-[11px] text-zinc-500 uppercase tracking-wider">{metric.label}</p>
              <p className="text-xl font-black text-white">{metric.value}</p>
            </div>;
          })}
        </div>
      </section>

      <section className="glass rounded-3xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Controles operativos</h2>
            <p className="text-sm text-zinc-500 mt-1">La seguridad prevalece sobre la autonomía.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setEnabled(!snapshot.enabled)} className="btn-neon text-black flex items-center gap-2">
              {snapshot.enabled ? <CircleStop className="w-4 h-4" aria-hidden="true" /> : <Play className="w-4 h-4" aria-hidden="true" />}
              {snapshot.enabled ? 'Pausar' : 'Reanudar'}
            </button>
            {snapshot.emergencyStopped ? (
              <button onClick={resumeAfterStop} className="glass neon-border rounded-lg px-3 py-2 text-sm text-amber-300 flex items-center gap-2">
                <RotateCcw className="w-4 h-4" aria-hidden="true" /> Recuperar
              </button>
            ) : (
              <button onClick={emergencyStop} className="glass border border-red-500/40 rounded-lg px-3 py-2 text-sm text-red-300 flex items-center gap-2">
                <CircleStop className="w-4 h-4" aria-hidden="true" /> Parada de emergencia
              </button>
            )}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="glass rounded-2xl p-4 flex items-center justify-between gap-4 cursor-pointer">
            <span className="flex items-center gap-3"><Shield className="w-5 h-5 text-amber-400" aria-hidden="true" /><span><strong className="text-white block">Modo seguro</strong><small className="text-zinc-500">Sin reintentos automáticos ni efectos no reversibles.</small></span></span>
            <input type="checkbox" checked={snapshot.safeMode} onChange={(event) => setSafeMode(event.target.checked)} className="accent-amber-500 w-5 h-5" />
          </label>
          <div className="glass rounded-2xl p-4 flex items-center gap-3">
            <Lock className="w-5 h-5 text-amber-400" aria-hidden="true" />
            <span><strong className="text-white block">Límite de capacidades</strong><small className="text-zinc-500">{snapshot.queue.length}/20 tareas persistidas localmente.</small></span>
          </div>
        </div>
        <p role="status" className="text-xs text-amber-300 font-mono">{notice}</p>
      </section>

      <section className="space-y-3">
        <div><h2 className="text-xl font-bold text-white">Capacidades disponibles</h2><p className="text-sm text-zinc-500">Cada capacidad tiene alcance limitado y trazable.</p></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {capabilityCards.map((capability) => (
            <button key={capability.kind} onClick={() => runCapability(capability.kind)} disabled={!snapshot.enabled || snapshot.emergencyStopped} className="glass rounded-2xl p-5 text-left hover:neon-border disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <div className="flex items-center justify-between gap-3"><h3 className="font-bold text-white">{capability.label}</h3><Zap className="w-4 h-4 text-amber-400" aria-hidden="true" /></div>
              <p className="text-sm text-zinc-500 mt-2">{capability.description}</p>
            </button>
          ))}
        </div>
      </section>

      <OmniMemoryPanel />
      <OmniInteroperabilityPanel />
      <OmniDiagnosticsPanel />
      <OmniTelemetryPanel />

      <section className="glass rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between gap-3"><div><h2 className="text-xl font-bold text-white">Registro de operaciones</h2><p className="text-sm text-zinc-500">Últimas tareas del runtime local.</p></div><button onClick={clearHistory} className="text-zinc-500 hover:text-red-300 transition-colors" title="Borrar historial"><Trash2 className="w-5 h-5" aria-hidden="true" /></button></div>
        {snapshot.queue.length === 0 ? <div className="py-10 text-center text-zinc-500">Sin tareas registradas.</div> : <div className="space-y-2">
          {snapshot.queue.slice().reverse().map((task) => <div key={task.id} className="glass rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div><div className="flex items-center gap-2"><span className="text-white font-semibold">{task.kind}</span><span className="text-[10px] uppercase tracking-wider text-amber-400">{statusLabel[task.status]}</span></div><p className="text-xs text-zinc-600 font-mono mt-1">{task.id} · prioridad {task.priority} · intentos {task.attempts}</p>{task.error && <p className="text-xs text-red-300 mt-1">{task.error}</p>}</div>
            {(task.status === 'queued' || task.status === 'running') && <button onClick={() => cancel(task.id)} className="text-xs text-red-300 hover:text-red-200">Cancelar</button>}
          </div>)}
        </div>}
      </section>
    </motion.div>
  );
};

export default OmniConsole;
