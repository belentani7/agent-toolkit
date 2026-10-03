import React, { useEffect, useMemo, useState } from 'react';
import { Command, CornerDownLeft, Pause, ShieldAlert, Sparkles, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOmni } from '../contexts/OmniContext';

interface Props { onNotice?: (message: string) => void }

const OmniCommandPalette: React.FC<Props> = ({ onNotice }) => {
  const navigate = useNavigate();
  const { snapshot, setEnabled, emergencyStop, clearHistory, enqueue } = useOmni();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((current) => !current);
      }
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const commands = useMemo(() => [
    { id: 'health', label: 'Ejecutar comprobación de salud', icon: Sparkles, run: () => { enqueue('health_check', { source: 'command-palette' }, 5); onNotice?.('Comprobación de salud añadida.'); } },
    { id: 'toggle', label: snapshot.enabled ? 'Pausar autonomía' : 'Reanudar autonomía', icon: Pause, run: () => { setEnabled(!snapshot.enabled); onNotice?.(snapshot.enabled ? 'Autonomía pausada.' : 'Autonomía reanudada.'); } },
    { id: 'quantum', label: 'Abrir Experiencia Cuántica', icon: Sparkles, run: () => navigate('/quantum') },
    { id: 'stop', label: 'Parada de emergencia', icon: ShieldAlert, run: () => { emergencyStop(); onNotice?.('Parada de emergencia activada.'); } },
    { id: 'clear', label: 'Borrar registro local', icon: Trash2, run: () => { clearHistory(); onNotice?.('Registro local borrado.'); } },
  ], [clearHistory, emergencyStop, enqueue, navigate, onNotice, setEnabled, snapshot.enabled]);

  const visible = commands.filter((command) => command.label.toLowerCase().includes(filter.toLowerCase()));

  return <>
    <button onClick={() => setOpen(true)} className="glass neon-border rounded-lg px-3 py-2 text-xs text-amber-300 font-mono flex items-center gap-2" aria-label="Abrir paleta de comandos"><Command className="w-4 h-4" aria-hidden="true" /> <span className="hidden sm:inline">Comandos</span><kbd className="text-[10px] text-zinc-500">⌘K</kbd></button>
    {open && <div className="fixed inset-0 z-[70] flex items-start justify-center p-4 sm:p-10" role="dialog" aria-modal="true" aria-label="Paleta de comandos">
      <button className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} aria-label="Cerrar paleta" />
      <div className="relative w-full max-w-xl glass neon-border rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center gap-3 px-4 border-b border-amber-500/10"><Command className="w-5 h-5 text-amber-400" aria-hidden="true" /><input autoFocus value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Escribe un comando..." className="flex-1 bg-transparent border-0 rounded-none px-0 py-4 text-white focus:ring-0" /><button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-white" aria-label="Cerrar"><X className="w-5 h-5" /></button></div>
        <div className="p-2">{visible.length === 0 ? <p className="p-4 text-sm text-zinc-500">No hay comandos que coincidan.</p> : visible.map((item, index) => { const Icon = item.icon; return <button key={item.id} onClick={() => { item.run(); setOpen(false); setFilter(''); }} className="w-full flex items-center justify-between gap-3 rounded-xl px-3 py-3 text-left hover:bg-amber-500/10 transition-colors"><span className="flex items-center gap-3"><Icon className="w-4 h-4 text-amber-400" aria-hidden="true" /><span className="text-sm text-white">{item.label}</span></span>{index === 0 && <CornerDownLeft className="w-4 h-4 text-zinc-600" aria-hidden="true" />}</button>; })}</div>
      </div>
    </div>}
  </>;
};

export default OmniCommandPalette;
