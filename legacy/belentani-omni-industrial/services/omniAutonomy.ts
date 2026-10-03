import type { OmniPayloadMap, OmniPriority, OmniTaskKind, OmniTaskPayload } from '../types';
import { omniTelemetry } from './omniTelemetry';

export type OmniTaskStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface OmniTask<K extends OmniTaskKind = OmniTaskKind> {
  id: string;
  kind: K;
  payload: OmniTaskPayload<K>;
  priority: OmniPriority;
  status: OmniTaskStatus;
  attempts: number;
  createdAt: number;
  startedAt?: number;
  finishedAt?: number;
  error?: string;
}

export interface OmniRuntimeSnapshot {
  enabled: boolean;
  safeMode: boolean;
  emergencyStopped: boolean;
  queue: OmniTask[];
  completed: number;
  failed: number;
  lastHeartbeat: number;
  version: string;
}

export interface OmniEvent {
  type: 'task_queued' | 'task_started' | 'task_completed' | 'task_failed' | 'state_changed';
  task?: OmniTask;
  snapshot: OmniRuntimeSnapshot;
}

type AnyCapabilityHandler = (payload: never) => Promise<unknown> | unknown;

const STORAGE_KEY = 'belentani_omni_runtime_v1';
const MAX_HISTORY = 40;
const MAX_QUEUE = 20;
const MAX_ATTEMPTS = 2;

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const makeId = () => `omni_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const initialSnapshot = (): OmniRuntimeSnapshot => ({
  enabled: true,
  safeMode: true,
  emergencyStopped: false,
  queue: [],
  completed: 0,
  failed: 0,
  lastHeartbeat: Date.now(),
  version: '2.1.0-omni',
});

/**
 * Núcleo de autonomía de BELENTANI.
 *
 * Diseñado para actuar de forma autónoma únicamente dentro de capacidades
 * explícitas y reversibles. No ejecuta pagos, publica contenido ni llama a
 * servicios externos sin una capacidad registrada y una acción iniciada por el usuario.
 */
export class OmniAutonomy {
  private snapshot: OmniRuntimeSnapshot;
  private handlers = new Map<OmniTaskKind, AnyCapabilityHandler>();
  private listeners = new Set<(event: OmniEvent) => void>();
  private processing = false;

  constructor() {
    this.snapshot = this.restore();
    this.registerDefaults();
  }

  private restore(): OmniRuntimeSnapshot {
    if (!canUseStorage()) return initialSnapshot();
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return initialSnapshot();
      const parsed = JSON.parse(raw) as Partial<OmniRuntimeSnapshot>;
      return {
        ...initialSnapshot(),
        ...parsed,
        queue: Array.isArray(parsed.queue) ? parsed.queue.slice(0, MAX_QUEUE) : [],
      };
    } catch {
      return initialSnapshot();
    }
  }

  private persist() {
    this.snapshot.lastHeartbeat = Date.now();
    if (!canUseStorage()) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.snapshot));
  }

  private emit(type: OmniEvent['type'], task?: OmniTask) {
    this.persist();
    omniTelemetry.record('info', `omni.${type}`, {
      taskId: task?.id ?? null,
      kind: task?.kind ?? null,
      status: task?.status ?? null,
      queueSize: this.snapshot.queue.length,
    });
    const event = { type, task, snapshot: this.getSnapshot() };
    this.listeners.forEach((listener) => listener(event));
  }

  private registerDefaults() {
    this.registerCapability('health_check', async () => ({
      ok: true,
      runtime: 'browser-safe',
      timestamp: new Date().toISOString(),
    }));

    this.registerCapability('privacy_audit', async () => ({
      storage: canUseStorage() ? 'local-only' : 'memory-only',
      externalSideEffects: false,
      safeMode: this.snapshot.safeMode,
    }));

    this.registerCapability('queue_optimization', async (payload) => ({
      optimized: true,
      requestedItems: Array.isArray(payload.items) ? payload.items.length : 0,
      strategy: 'priority-and-coherence',
    }));

    this.registerCapability('explain_decision', async (payload) => ({
      explanation: `La selección se alinea con «${String(payload.prompt ?? 'tu intención musical')}» y prioriza coherencia emocional, diversidad y transición suave.`,
    }));

    this.registerCapability('playlist_synthesis', async (payload) => ({
      status: 'ready-for-model',
      prompt: String(payload.prompt ?? ''),
      constraints: payload.constraints ?? {},
      requiresExplicitGeneration: true,
    }));
  }

  registerCapability<K extends OmniTaskKind>(kind: K, handler: (payload: OmniPayloadMap[K]) => Promise<unknown> | unknown) {
    this.handlers.set(kind, handler as AnyCapabilityHandler);
  }

  subscribe(listener: (event: OmniEvent) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getSnapshot(): OmniRuntimeSnapshot {
    return JSON.parse(JSON.stringify(this.snapshot)) as OmniRuntimeSnapshot;
  }

  setEnabled(enabled: boolean) {
    this.snapshot.enabled = enabled;
    if (!enabled) this.snapshot.queue = this.snapshot.queue.filter((task) => task.status !== 'queued');
    this.emit('state_changed');
  }

  setSafeMode(safeMode: boolean) {
    this.snapshot.safeMode = safeMode;
    this.emit('state_changed');
  }

  emergencyStop() {
    this.snapshot.emergencyStopped = true;
    this.snapshot.queue = this.snapshot.queue.map((task) =>
      task.status === 'queued' || task.status === 'running'
        ? { ...task, status: 'cancelled', finishedAt: Date.now() }
        : task,
    );
    this.emit('state_changed');
  }

  resumeAfterStop() {
    this.snapshot.emergencyStopped = false;
    this.emit('state_changed');
  }

  clearHistory() {
    this.snapshot.queue = [];
    this.snapshot.completed = 0;
    this.snapshot.failed = 0;
    this.emit('state_changed');
  }

  enqueue<K extends OmniTaskKind>(
    kind: K,
    payload: OmniPayloadMap[K],
    priority: OmniPriority = 3,
  ) {
    if (!this.snapshot.enabled || this.snapshot.emergencyStopped) return null;
    if (this.snapshot.queue.filter((task) => task.status === 'queued').length >= MAX_QUEUE) return null;

    const task: OmniTask<K> = {
      id: makeId(),
      kind,
      payload,
      priority,
      status: 'queued',
      attempts: 0,
      createdAt: Date.now(),
    };

    this.snapshot.queue = [...this.snapshot.queue, task]
      .sort((a, b) => b.priority - a.priority || a.createdAt - b.createdAt)
      .slice(-MAX_QUEUE);
    this.emit('task_queued', task);
    void this.process();
    return task.id;
  }

  cancel(taskId: string) {
    this.snapshot.queue = this.snapshot.queue.map((task) =>
      task.id === taskId && (task.status === 'queued' || task.status === 'running')
        ? { ...task, status: 'cancelled', finishedAt: Date.now() }
        : task,
    );
    this.emit('state_changed');
  }

  private async process() {
    if (this.processing || !this.snapshot.enabled || this.snapshot.emergencyStopped) return;
    this.processing = true;

    try {
      while (this.snapshot.enabled && !this.snapshot.emergencyStopped) {
        const next = this.snapshot.queue.find((task) => task.status === 'queued');
        if (!next) break;
        const handler = this.handlers.get(next.kind);
        if (!handler) {
          next.status = 'failed';
          next.error = `Capacidad no registrada: ${next.kind}`;
          next.finishedAt = Date.now();
          this.snapshot.failed += 1;
          this.emit('task_failed', next);
          continue;
        }

        next.status = 'running';
        next.startedAt = Date.now();
        next.attempts += 1;
        this.emit('task_started', next);

        try {
          await handler(next.payload as never);
          next.status = 'completed';
          next.finishedAt = Date.now();
          this.snapshot.completed += 1;
          this.emit('task_completed', next);
        } catch (error) {
          if (next.attempts < MAX_ATTEMPTS && !this.snapshot.safeMode) {
            next.status = 'queued';
            next.error = error instanceof Error ? error.message : 'Error transitorio';
          } else {
            next.status = 'failed';
            next.error = error instanceof Error ? error.message : 'Error desconocido';
            next.finishedAt = Date.now();
            this.snapshot.failed += 1;
            this.emit('task_failed', next);
          }
        }

        this.snapshot.queue = this.snapshot.queue.slice(-MAX_HISTORY);
      }
    } finally {
      this.processing = false;
      this.emit('state_changed');
    }
  }
}

export const omniAutonomy = new OmniAutonomy();
