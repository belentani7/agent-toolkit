export interface OmniMemoryRecord {
  id: string;
  namespace: 'music' | 'privacy' | 'system';
  text: string;
  tags: string[];
  vector: number[];
  createdAt: number;
  lastUsedAt: number;
  useCount: number;
}

export interface OmniMemoryMatch extends OmniMemoryRecord {
  score: number;
}

const STORAGE_KEY = 'belentani_omni_memory_v1';
const DIMENSIONS = 48;
const MAX_RECORDS = 160;

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
const id = () => `mem_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
const tokens = (text: string) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((token) => token.length > 2);

const safeText = (text: string) => text.replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi, '[email]').replace(/\b\d{8,}\b/g, '[number]').slice(0, 500);

const hash = (value: string) => {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return Math.abs(result >>> 0);
};

export const embedText = (text: string) => {
  const vector = Array.from({ length: DIMENSIONS }, () => 0);
  tokens(text).forEach((token) => {
    const tokenHash = hash(token);
    const slot = tokenHash % DIMENSIONS;
    vector[slot] += 1;
    vector[(tokenHash >>> 5) % DIMENSIONS] += 0.5;
  });
  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
  return vector.map((value) => value / magnitude);
};

const similarity = (left: number[], right: number[]) => left.reduce((sum, value, index) => sum + value * (right[index] ?? 0), 0);

class OmniMemory {
  private records: OmniMemoryRecord[];

  constructor() {
    this.records = this.restore();
  }

  private restore(): OmniMemoryRecord[] {
    if (!canUseStorage()) return [];
    try {
      const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(stored) ? stored.slice(0, MAX_RECORDS) : [];
    } catch {
      return [];
    }
  }

  private persist() {
    if (canUseStorage()) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.records.slice(0, MAX_RECORDS)));
  }

  remember(text: string, namespace: OmniMemoryRecord['namespace'] = 'music', tags: string[] = []) {
    const clean = safeText(text.trim());
    if (!clean) return null;
    const existing = this.records.find((record) => record.text === clean && record.namespace === namespace);
    if (existing) {
      existing.lastUsedAt = Date.now();
      existing.useCount += 1;
      this.persist();
      return existing.id;
    }
    const now = Date.now();
    const record: OmniMemoryRecord = {
      id: id(), namespace, text: clean, tags: tags.slice(0, 12), vector: embedText(clean), createdAt: now, lastUsedAt: now, useCount: 1,
    };
    this.records = [record, ...this.records].slice(0, MAX_RECORDS);
    this.persist();
    return record.id;
  }

  recall(query: string, topK = 5, namespace?: OmniMemoryRecord['namespace']): OmniMemoryMatch[] {
    const vector = embedText(query);
    return this.records
      .filter((record) => !namespace || record.namespace === namespace)
      .map((record) => ({ ...record, score: similarity(vector, record.vector) }))
      .filter((record) => record.score > 0)
      .sort((left, right) => right.score - left.score || right.lastUsedAt - left.lastUsedAt)
      .slice(0, topK);
  }

  touch(idToTouch: string) {
    const record = this.records.find((item) => item.id === idToTouch);
    if (!record) return;
    record.lastUsedAt = Date.now();
    record.useCount += 1;
    this.persist();
  }

  forget(idToForget: string) {
    this.records = this.records.filter((record) => record.id !== idToForget);
    this.persist();
  }

  clear(namespace?: OmniMemoryRecord['namespace']) {
    this.records = namespace ? this.records.filter((record) => record.namespace !== namespace) : [];
    this.persist();
  }

  exportMetadata() {
    return { count: this.records.length, namespaces: [...new Set(this.records.map((record) => record.namespace))], storage: canUseStorage() ? 'localStorage' : 'memory' };
  }
}

export const omniMemory = new OmniMemory();
