import React from 'react';
import type { Playlist } from '../types';

interface PlaylistDisplayProps {
  playlist: Playlist;
}

export const PlaylistDisplay: React.FC<PlaylistDisplayProps> = ({ playlist }) => {
  return (
    <div className="glass border border-amber-500/20 rounded-2xl p-6 space-y-4">
      <h2 className="text-2xl font-bold text-white">{playlist.name}</h2>
      <div className="space-y-2">
        {playlist.songs?.map((song, idx) => (
          <div key={idx} className="text-zinc-300">
            {song}
          </div>
        ))}
      </div>
    </div>
  );
};
