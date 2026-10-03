import React from 'react';

export const Loader: React.FC<{ message?: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center gap-4">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
    {message && <p className="text-zinc-400">{message}</p>}
  </div>
);
