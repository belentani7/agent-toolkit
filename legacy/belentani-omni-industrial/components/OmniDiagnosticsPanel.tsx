import React, { useEffect, useState } from 'react';
import { CheckCircle2, CircleAlert, Gauge, RefreshCw, WifiOff } from 'lucide-react';
import { runOmniDiagnostics, type DiagnosticReport } from '../services/omniDiagnostics';

const OmniDiagnosticsPanel: React.FC = () => {
  const [report, setReport] = useState<DiagnosticReport | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try { setReport(await runOmniDiagnostics()); } finally { setLoading(false); }
  };

  useEffect(() => { void run(); }, []);

  return <section className="glass rounded-3xl p-6 space-y-5">
    <div className="flex items-center justify-between gap-3"><div className="flex items-start gap-3"><Gauge className="w-6 h-6 text-amber-400 mt-1" aria-hidden="true" /><div><h2 className="text-xl font-bold text-white">Diagnóstico autónomo</h2><p className="text-sm text-zinc-500 mt-1">Comprobaciones locales y del backend sin enviar datos personales.</p></div></div><button onClick={() => void run()} disabled={loading} className="glass neon-border rounded-lg px-3 py-2 text-amber-300 disabled:opacity-50" title="Actualizar diagnóstico"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" /></button></div>
    {report ? <><div className="flex items-center justify-between glass rounded-2xl p-4"><span className="text-sm text-zinc-400">Salud operativa</span><strong className={`text-2xl font-black ${report.score >= 80 ? 'text-green-300' : report.score >= 50 ? 'text-amber-300' : 'text-red-300'}`}>{report.score}%</strong></div><div className="grid sm:grid-cols-2 gap-2">{report.checks.map((check) => { const Icon = check.status === 'ok' ? CheckCircle2 : check.status === 'offline' ? WifiOff : CircleAlert; return <div key={check.id} className="glass rounded-xl p-3 flex items-start gap-3"><Icon className={`w-4 h-4 mt-0.5 ${check.status === 'ok' ? 'text-green-300' : check.status === 'offline' ? 'text-zinc-500' : 'text-amber-300'}`} aria-hidden="true" /><div><p className="text-sm text-white">{check.label}</p><p className="text-xs text-zinc-500 mt-1">{check.detail}</p></div></div>; })}</div></> : <p className="text-sm text-zinc-500">Ejecutando diagnóstico…</p>}
  </section>;
};

export default OmniDiagnosticsPanel;
