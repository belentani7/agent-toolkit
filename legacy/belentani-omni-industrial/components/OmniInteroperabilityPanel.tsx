import React, { useState } from 'react';
import { Download, FileJson, Share2, Upload } from 'lucide-react';
import { downloadText, parseInteroperable, serializePlaylist, serializePlaylistCsv, shareText } from '../services/omniInteroperability';
import type { Playlist } from '../types';

const OmniInteroperabilityPanel: React.FC = () => {
  const [playlist, setPlaylist] = useState<Playlist>({ name: 'BELENTANI OMNI Session', songs: ['Midnight Signals', 'Amber Horizon'] });
  const [notice, setNotice] = useState('Formato interoperable BELENTANI v1 listo.');

  const importFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        setPlaylist(parseInteroperable(String(reader.result || '')));
        setNotice('Playlist importada y validada.');
      } catch (error) {
        setNotice(error instanceof Error ? error.message : 'No se pudo importar el archivo.');
      }
    };
    reader.readAsText(file);
  };

  const share = async () => {
    const result = await shareText(playlist.name || 'BELENTANI', serializePlaylist(playlist));
    setNotice(result === 'shared' ? 'Sesión compartida.' : result === 'copied' ? 'Sesión copiada al portapapeles.' : 'Compartir no disponible en este navegador.');
  };

  return (
    <section className="glass rounded-3xl p-6 space-y-5">
      <div className="flex items-start gap-3"><Share2 className="w-6 h-6 text-amber-400 mt-1" aria-hidden="true" /><div><h2 className="text-xl font-bold text-white">Interoperabilidad universal</h2><p className="text-sm text-zinc-500 mt-1">Sincroniza tu trabajo mediante un formato abierto, descargable y portable.</p></div></div>
      <input value={playlist.name} onChange={(event) => setPlaylist((current) => ({ ...current, name: event.target.value }))} className="w-full px-4 py-3 text-sm text-white" aria-label="Título de la playlist" />
      <textarea value={(playlist.songs || []).join('\n')} onChange={(event) => setPlaylist((current) => ({ ...current, songs: event.target.value.split('\n').filter(Boolean) }))} rows={4} className="w-full px-4 py-3 text-sm text-white resize-y" aria-label="Canciones, una por línea" />
      <div className="flex flex-wrap gap-2">
        <button onClick={() => { downloadText('belentani-playlist.json', serializePlaylist(playlist)); setNotice('JSON descargado.'); }} className="glass neon-border rounded-lg px-3 py-2 text-sm text-amber-300 flex items-center gap-2"><FileJson className="w-4 h-4" aria-hidden="true" /> JSON</button>
        <button onClick={() => { downloadText('belentani-playlist.csv', serializePlaylistCsv(playlist), 'text/csv'); setNotice('CSV descargado.'); }} className="glass neon-border rounded-lg px-3 py-2 text-sm text-amber-300 flex items-center gap-2"><Download className="w-4 h-4" aria-hidden="true" /> CSV</button>
        <label className="glass neon-border rounded-lg px-3 py-2 text-sm text-amber-300 flex items-center gap-2 cursor-pointer"><Upload className="w-4 h-4" aria-hidden="true" /> Importar<input type="file" accept="application/json,.json" onChange={(event) => importFile(event.target.files?.[0])} className="hidden" /></label>
        <button onClick={() => void share()} className="btn-neon text-black flex items-center gap-2"><Share2 className="w-4 h-4" aria-hidden="true" /> Compartir</button>
      </div>
      <p role="status" className="text-xs text-amber-300 font-mono">{notice}</p>
    </section>
  );
};

export default OmniInteroperabilityPanel;
