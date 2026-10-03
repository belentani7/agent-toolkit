export interface DiagnosticCheck {
  id: string;
  label: string;
  status: 'ok' | 'warning' | 'offline';
  detail: string;
  durationMs?: number;
}

export interface DiagnosticReport {
  generatedAt: string;
  checks: DiagnosticCheck[];
  score: number;
}

const timed = async <T>(operation: () => Promise<T>) => {
  const started = performance.now();
  const value = await operation();
  return { value, durationMs: Math.round(performance.now() - started) };
};

export const runOmniDiagnostics = async (): Promise<DiagnosticReport> => {
  const checks: DiagnosticCheck[] = [];
  const storageAvailable = (() => {
    try {
      const key = '__omni_probe__';
      localStorage.setItem(key, '1');
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  })();

  checks.push({ id: 'storage', label: 'Persistencia local', status: storageAvailable ? 'ok' : 'warning', detail: storageAvailable ? 'Memoria local disponible.' : 'El navegador bloquea almacenamiento local.' });
  checks.push({ id: 'network', label: 'Conectividad', status: navigator.onLine ? 'ok' : 'offline', detail: navigator.onLine ? 'Red disponible.' : 'Modo offline activo.' });
  checks.push({ id: 'service-worker', label: 'Offline shell', status: 'serviceWorker' in navigator ? 'ok' : 'warning', detail: 'serviceWorker' in navigator ? 'El navegador permite caché offline.' : 'Service worker no soportado.' });

  if (typeof performance !== 'undefined' && 'memory' in performance) {
    const memory = (performance as Performance & { memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
    const usage = memory ? memory.usedJSHeapSize / memory.jsHeapSizeLimit : 0;
    checks.push({ id: 'memory', label: 'Memoria de ejecución', status: usage < 0.8 ? 'ok' : 'warning', detail: `${Math.round(usage * 100)}% del límite JS estimado.` });
  } else {
    checks.push({ id: 'memory', label: 'Memoria de ejecución', status: 'ok', detail: 'El navegador no expone métricas de heap.' });
  }

  try {
    const server = await timed(() => fetch('/api/health', { headers: { Accept: 'application/json' } }));
    checks.push({ id: 'server', label: 'Servidor OMNI', status: server.value.ok ? 'ok' : 'warning', detail: server.value.ok ? `Backend disponible (${server.durationMs} ms).` : 'Backend respondió con estado no saludable.', durationMs: server.durationMs });
  } catch {
    checks.push({ id: 'server', label: 'Servidor OMNI', status: 'offline', detail: 'Backend no disponible; la interfaz local continúa operativa.' });
  }

  const score = Math.round((checks.filter((check) => check.status === 'ok').length / checks.length) * 100);
  return { generatedAt: new Date().toISOString(), checks, score };
};
