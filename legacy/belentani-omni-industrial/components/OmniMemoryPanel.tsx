import React, { useMemo, useState } from 'react';
import { Brain, Search, ShieldCheck, Trash2 } from 'lucide-react';
import { omniMemory, type OmniMemoryMatch } from '../services/omniMemory';

const OmniMemoryPanel: React.FC = () => {
  const [draft, setDraft] = useState('');
  const [query, setQuery] = useState('');
  const [matches, setMatches] = useState<OmniMemoryMatch[]>([]);
  const [notice, setNotice] = useState('Memoria local vacía y bajo tu control.');
  const metadata = useMemo(() => omniMemory.exportMetadata(), [matches, notice]);

  const remember = () => {
    const memoryId = omniMemory.remember(draft, 'music', ['user-intent']);
    setDraft('');
    setNotice(memoryId ? 'Preferencia guardada localmente.' : 'No se guardó texto vacío.');
  };

  const search = () => {
    setMatches(omniMemory.recall(query, 6, 'music'));
    setNotice('Búsqueda semántica local completada.');
  };

  const clear = () => {
    omniMemory.clear('music');
    setMatches([]);
    setNotice('Memoria musical eliminada.');
  };

  return (
    <section className="glass rounded-3xl p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-3"><Brain className="w-6 h-6 text-amber-400 mt-1" aria-hidden="true" /><div><h2 className="text-xl font-bold text-white">Memoria vectorial privada</h2><p className="text-sm text-zinc-500 mt-1">Preferencias semánticas guardadas en este dispositivo, sin servidor vectorial externo.</p></div></div>
        <div className="flex items-center gap-2 text-xs text-green-300 font-mono"><ShieldCheck className="w-4 h-4" aria-hidden="true" /> {metadata.count} recuerdos</div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2"><input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && remember()} placeholder="Ej.: prefiero electrónica cálida sin voces" className="flex-1 px-4 py-3 text-sm text-white" /><button onClick={remember} className="btn-neon text-black px-4 py-3">Guardar</button></div>
      <div className="flex flex-col sm:flex-row gap-2"><input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && search()} placeholder="Buscar una preferencia" className="flex-1 px-4 py-3 text-sm text-white" /><button onClick={search} className="glass neon-border rounded-lg px-4 py-3 text-amber-300 flex items-center justify-center gap-2"><Search className="w-4 h-4" aria-hidden="true" /> Buscar</button></div>
      {matches.length > 0 && <div className="space-y-2">{matches.map((match) => <div key={match.id} className="glass rounded-xl p-4 flex items-start justify-between gap-4"><div><p className="text-sm text-white">{match.text}</p><p className="text-[11px] text-zinc-600 font-mono mt-1">similitud {(match.score * 100).toFixed(0)}% · usado {match.useCount} veces</p></div><button onClick={() => { omniMemory.forget(match.id); setMatches((current) => current.filter((item) => item.id !== match.id)); setNotice('Recuerdo eliminado.'); }} className="text-zinc-500 hover:text-red-300" title="Eliminar recuerdo"><Trash2 className="w-4 h-4" aria-hidden="true" /></button></div>)}</div>}
      <div className="flex items-center justify-between gap-3 border-t border-amber-500/10 pt-4"><p role="status" className="text-xs text-amber-300 font-mono">{notice}</p><button onClick={clear} className="text-xs text-red-300 hover:text-red-200">Borrar memoria</button></div>
    </section>
  );
};

export default OmniMemoryPanel;
