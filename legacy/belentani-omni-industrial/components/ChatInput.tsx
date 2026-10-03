import React from 'react';
import { Send } from 'lucide-react';
import type { PlaylistRequest } from '../types';

interface ChatInputProps {
  onGenerate: (request: PlaylistRequest) => void;
  isLoading: boolean;
  value: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onGenerate, isLoading, value }) => {
  const [input, setInput] = React.useState(value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onGenerate({ prompt: input, songCount: 10 });
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass border border-amber-500/20 rounded-2xl p-4 flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe tu vibe..."
        className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="p-2 text-amber-400 hover:text-amber-300 disabled:opacity-50"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
};
