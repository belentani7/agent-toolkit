import express from 'express';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { OmniTaskInputSchema } from '../services/validation';
import { omniTelemetry } from '../services/omniTelemetry';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const startedAt = Date.now();
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 30;
const requestWindows = new Map<string, { count: number; resetAt: number }>();

app.disable('x-powered-by');
app.use(express.json({ limit: '64kb' }));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), geolocation=(), payment=(), usb=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' https://generativelanguage.googleapis.com; worker-src 'self' blob:",
  );
  next();
});

app.get('/api/health', (_req, res) => {
  omniTelemetry.record('info', 'server.health_check', { service: 'belentani-omni' });
  res.json({
    ok: true,
    service: 'belentani-omni',
    version: '2.1.0-omni',
    uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/omni/capabilities', (_req, res) => {
  res.json({
    safeModeDefault: true,
    externalSideEffects: false,
    capabilities: [
      'playlist_synthesis',
      'explain_decision',
      'privacy_audit',
      'queue_optimization',
      'health_check',
    ],
  });
});

app.post('/api/omni/tasks', (req, res) => {
  const clientKey = req.ip || 'unknown';
  const now = Date.now();
  const current = requestWindows.get(clientKey);
  const windowState = !current || current.resetAt <= now ? { count: 0, resetAt: now + RATE_WINDOW_MS } : current;
  windowState.count += 1;
  requestWindows.set(clientKey, windowState);

  if (windowState.count > RATE_LIMIT) {
    omniTelemetry.record('warn', 'server.rate_limited', { limit: RATE_LIMIT });
    res.status(429).json({ ok: false, error: 'Demasiadas solicitudes. Intenta de nuevo más tarde.' });
    return;
  }

  const parsed = OmniTaskInputSchema.safeParse(req.body);
  if (!parsed.success) {
    omniTelemetry.record('warn', 'server.task_rejected', { issueCount: parsed.error.issues.length });
    res.status(400).json({
      ok: false,
      error: 'Solicitud de tarea no válida.',
      issues: parsed.error.issues.map((issue) => issue.path.join('.')),
    });
    return;
  }

  const taskId = randomUUID();
  omniTelemetry.record('info', 'server.task_accepted', {
    taskId,
    kind: parsed.data.kind,
    priority: parsed.data.priority,
  });
  res.status(202).json({ ok: true, taskId, accepted: parsed.data, externalSideEffects: false });
});

const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath, { maxAge: '1h', index: 'index.html' }));
app.use((_req, res) => res.sendFile(path.join(distPath, 'index.html')));

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const isJsonParseError = error instanceof SyntaxError && typeof error === 'object' && error !== null && 'body' in error;
  console.error('Unhandled server error:', error instanceof Error ? error.message : 'unknown error');
  if (res.headersSent) return;
  if (isJsonParseError) {
    res.status(400).json({ ok: false, error: 'JSON malformado.' });
    return;
  }
  res.status(500).json({ ok: false, error: 'Error interno controlado.' });
});

export default app;
