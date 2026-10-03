export type TelemetryLevel = 'info' | 'warn' | 'error';

export interface TelemetryEvent {
  readonly id: string;
  readonly at: string;
  readonly level: TelemetryLevel;
  readonly name: string;
  readonly correlationId: string;
  readonly attributes: Readonly<Record<string, string | number | boolean | null>>;
}

const MAX_EVENTS = 120;
const EMAIL_PATTERN = /[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi;
const LONG_NUMBER_PATTERN = /\b\d{8,}\b/g;

const createId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const sanitize = (value: string | number | boolean | null): string | number | boolean | null => {
  if (typeof value !== 'string') return value;
  return value.replace(EMAIL_PATTERN, '[email]').replace(LONG_NUMBER_PATTERN, '[number]').slice(0, 240);
};

class OmniTelemetry {
  private events: TelemetryEvent[] = [];
  private listeners = new Set<(event: TelemetryEvent) => void>();

  record(level: TelemetryLevel, name: string, attributes: Record<string, string | number | boolean | null> = {}, correlationId = createId('corr')) {
    const event: TelemetryEvent = {
      id: createId('evt'),
      at: new Date().toISOString(),
      level,
      name: name.slice(0, 100),
      correlationId,
      attributes: Object.fromEntries(Object.entries(attributes).slice(0, 20).map(([key, value]) => [key.slice(0, 60), sanitize(value)])),
    };
    this.events = [...this.events, event].slice(-MAX_EVENTS);
    this.listeners.forEach((listener) => listener(event));
    if (typeof console !== 'undefined') {
      const method = level === 'error' ? console.error : level === 'warn' ? console.warn : console.info;
      method('[BELENTANI]', JSON.stringify(event));
    }
    return event;
  }

  subscribe(listener: (event: TelemetryEvent) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  snapshot() {
    return this.events.slice().reverse();
  }

  clear() {
    this.events = [];
  }
}

export const omniTelemetry = new OmniTelemetry();
export const createCorrelationId = () => createId('corr');
