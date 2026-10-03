import type { Playlist, PlaylistRequest } from '../types';
import { getQuantumGemini } from './quantumGeminiService';
import { PlaylistRequestSchema } from './validation';

const makePlaylistName = (prompt: string) => {
  const normalized = prompt.replace(/\s+/g, ' ').trim();
  return normalized.length > 48 ? `BELENTANI · ${normalized.slice(0, 48)}…` : `BELENTANI · ${normalized}`;
};

/**
 * Punto de entrada de generación usado por Home y Party Mode.
 * Valida la solicitud antes de delegar en el adaptador Quantum y normaliza
 * la respuesta para que la UI solo reciba el contrato Playlist.
 */
export const generatePlaylist = async (request: PlaylistRequest): Promise<Playlist> => {
  const parsedRequest = PlaylistRequestSchema.safeParse(request);
  if (!parsedRequest.success) {
    throw new Error('La solicitud debe incluir una descripción válida y entre 1 y 100 canciones.');
  }

  const response = await getQuantumGemini().generateQuantumPlaylist(parsedRequest.data);
  const songs = response.songs.map((song) => `${song.songTitle} — ${song.artist}`);

  return {
    id: `playlist_${Date.now()}`,
    name: makePlaylistName(parsedRequest.data.prompt),
    songs,
  };
};
