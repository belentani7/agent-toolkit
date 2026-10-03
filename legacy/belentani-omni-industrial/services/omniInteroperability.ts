import type { Playlist } from '../types';

export interface InteroperablePlaylist {
  schema: 'belentani.playlist';
  version: 1;
  exportedAt: string;
  title: string;
  songs: string[];
  metadata?: Record<string, string | number | boolean>;
}

export const toInteroperable = (playlist: Playlist): InteroperablePlaylist => ({
  schema: 'belentani.playlist',
  version: 1,
  exportedAt: new Date().toISOString(),
  title: playlist.name || 'BELENTANI Session',
  songs: Array.isArray(playlist.songs) ? playlist.songs.map(String) : [],
  metadata: { source: 'BELENTANI OMNI' },
});

export const serializePlaylist = (playlist: Playlist) => JSON.stringify(toInteroperable(playlist), null, 2);

export const serializePlaylistCsv = (playlist: Playlist) => {
  const rows = [['title', 'song'], ...toInteroperable(playlist).songs.map((song) => [playlist.name || 'BELENTANI Session', song])];
  return rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
};

export const parseInteroperable = (raw: string): Playlist => {
  const parsed = JSON.parse(raw) as Partial<InteroperablePlaylist>;
  if (parsed.schema !== 'belentani.playlist' || parsed.version !== 1 || !Array.isArray(parsed.songs)) {
    throw new Error('Formato de playlist no compatible.');
  }
  return { name: parsed.title || 'Playlist importada', songs: parsed.songs.map(String) };
};

export const downloadText = (filename: string, content: string, type = 'application/json') => {
  if (typeof document === 'undefined') return;
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

type ShareNavigator = Navigator & {
  share?: (data: { title: string; text: string }) => Promise<void>;
  clipboard?: { writeText: (value: string) => Promise<void> };
};

export const shareText = async (title: string, text: string) => {
  const browserNavigator = typeof window !== 'undefined' ? window.navigator as ShareNavigator : null;
  if (browserNavigator?.share) {
    await browserNavigator.share({ title, text });
    return 'shared' as const;
  }
  if (browserNavigator?.clipboard) {
    await browserNavigator.clipboard.writeText(text);
    return 'copied' as const;
  }
  return 'unsupported' as const;
};
