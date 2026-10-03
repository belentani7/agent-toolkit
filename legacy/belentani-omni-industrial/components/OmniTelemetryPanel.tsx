import React, { useEffect, useState } from 'react';
import { Activity, CircleAlert, Info, Trash2, TriangleAlert } from 'lucide-react';
import { omniTelemetry, type TelemetryEvent } from '../services/omniTelemetry';

const levelIcon = (level: TelemetryEvent['level']) => {
  if (level === 'error') return CircleAlert;
  if (level === 'warn') return TriangleAlert;
  return Info;
};

const OmniTelemetryPanel: React.FC = () => {
  const [events, setEvents] = useState<TelemetryEvent[]>(() => omniTelemetry.snapshot());

  useEffect(() => omniTelemetry.subscribe((event) => setEvents((current) => [event, ...current].slice(0, 12))), []);

  return <section className="glass rounded-3xl p-6 space-y-4" aria-labelledby="telemetry-heading">
    <div className="flex items-start justify-between gap-3"><div className="flex items-start gap-3"><Activity className="w-5 h-5 text-amber-400 mt-1" aria-hidden="true" /><div><h2 id="telemetry-heading" className="text-xl font-bold text-white">Auditoría técnica</h2><p className="text-sm text-zinc-500 mt-1">Eventos locales estructurados; no se transmiten a terceros.</p></div></div><button type="button" onClick={() => { omniTelemetry.clear(); setEvents([]); }} className="text-zinc-500 hover:text-red-300 transition-colors" title="Borrar auditoría" aria-label="Borrar auditoría"><Trash2 className="w-4 h-4" aria-hidden="true" /></button></div>
    {events.length === 0 ? <p className="text-sm text-zinc-500 py-4">Todavía no hay eventos de auditoría.</p> : <ol className="space-y-2 max-h-72 overflow-auto" aria-live="polite">{events.map((event) => { const Icon = levelIcon(event.level); return <li key={event.id} className="glass rounded-xl p-3 flex items-start gap-3"><Icon className={`w-4 h-4 mt-0.5 ${event.level === 'error' ? 'text-red-300' : event.level === 'warn' ? 'text-amber-300' : 'text-green-300'}`} aria-hidden="true" /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><strong className="text-sm text-white break-all">{event.name}</strong><time className="text-[10px] text-zinc-600 font-mono" dateTime={event.at}>{new Date(event.at).toLocaleTimeString()}</time></div><p className="text-[10px] text-zinc-600 font-mono mt-1">{event.correlationId}</p></div></li>; })}</ol>}
  </section>;
};

export default OmniTelemetryPanel;
