import type { PlaylistRequest } from '../types';
import { parseQuantumPlaylistResponse, PlaylistRequestSchema, type ValidatedQuantumPlaylistResponse } from './validation';

export type { ValidatedQuantumPlaylistResponse as QuantumPlaylistResponse } from './validation';
import { omniMemory } from './omniMemory';
import { analyzeSonicIntent, buildNarrativeArc } from './neuroSonicEngine';
import { CircuitBreaker, withTimeout } from './omniResilience';
import { omniTelemetry, createCorrelationId } from './omniTelemetry';

interface GeminiResponse {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
}

const fallbackResponse = (prompt: string): ValidatedQuantumPlaylistResponse => {
  const profile = analyzeSonicIntent(prompt);
  return {
  songs: [
    {
      songTitle: 'Midnight Signals',
      artist: 'BELENTANI Session',
      reason: `Alinea el pulso y la atmósfera con «${prompt}».`,
      emotionalLayer: 'Introspección con energía ascendente.',
      artisticProgression: 'Abre la sesión y deja espacio para el descubrimiento.',
      vibeScore: 88,
    },
    {
      songTitle: 'Amber Horizon',
      artist: 'BELENTANI Session',
      reason: 'Aporta contraste sin romper la identidad sonora.',
      emotionalLayer: 'Calma luminosa y resolución.',
      artisticProgression: 'Cierra el arco con una transición cálida.',
      vibeScore: 91,
    },
  ],
  convergenceScore: 89,
  narrativeArc: buildNarrativeArc(profile),
  recommendations: ['Añade una referencia de artista si buscas una textura concreta.', 'Usa duración para controlar el arco.', 'Revisa cada explicación antes de guardar la playlist.'],
  };
};

/**
 * Adaptador de IA para BELENTANI.
 * En producción se recomienda enrutar la clave por el servidor; en desarrollo
 * funciona sin clave mediante un fallback determinista y transparente.
 */
class QuantumGeminiService {
  private readonly apiKey?: string;
  private readonly model: string;
  private readonly circuit = new CircuitBreaker();

  constructor(apiKey?: string, model = 'gemini-2.0-flash') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generateQuantumPlaylist(request: PlaylistRequest & { mood?: string }): Promise<ValidatedQuantumPlaylistResponse> {
    const validatedRequest = PlaylistRequestSchema.safeParse(request);
    if (!validatedRequest.success) return fallbackResponse('Solicitud no válida');
    const safeRequest = validatedRequest.data;
    const correlationId = createCorrelationId();
    omniTelemetry.record('info', 'quantum.generation_started', { songCount: safeRequest.songCount, hasMood: Boolean(safeRequest.mood) }, correlationId);
    const related = omniMemory.recall(safeRequest.prompt, 3, 'music');
    const prompt = this.buildPrompt(safeRequest, related.map((item) => item.text));
    omniMemory.remember(safeRequest.prompt, 'music', ['generation-intent']);
    if (!this.apiKey || !this.circuit.canRequest()) {
      omniTelemetry.record('warn', 'quantum.fallback_local', { reason: !this.apiKey ? 'missing_api_key' : 'circuit_open' }, correlationId);
      return fallbackResponse(safeRequest.prompt);
    }

    try {
      const response = await withTimeout(fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${encodeURIComponent(this.apiKey)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }), 12_000, 'El motor de IA no respondió a tiempo.');
      if (!response.ok) throw new Error(`Gemini request failed with ${response.status}`);
      this.circuit.recordSuccess();
      omniTelemetry.record('info', 'quantum.provider_success', { provider: 'gemini' }, correlationId);
      const data = await response.json() as GeminiResponse;
      const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('') ?? '';
      return this.parseResponse(text, safeRequest.prompt);
    } catch (error) {
      this.circuit.recordFailure();
      omniTelemetry.record('warn', 'quantum.provider_fallback', { reason: error instanceof Error ? error.name : 'unknown_error' }, correlationId);
      console.warn('Quantum service fallback:', error);
      return fallbackResponse(safeRequest.prompt);
    }
  }

  async analyzeCoherence(song1: string, song2: string): Promise<number> {
    if (!this.apiKey) return 82;
    const result = await this.generateQuantumPlaylist({ prompt: `Compara coherencia entre ${song1} y ${song2}`, songCount: 2 });
    return Math.round(result.convergenceScore);
  }

  async explainDecision(song: string, context: string) {
    const result = await this.generateQuantumPlaylist({ prompt: `Explica la elección de ${song} dentro de ${context}`, songCount: 1 });
    return result.songs[0] ?? fallbackResponse(context).songs[0];
  }

  private buildPrompt(request: PlaylistRequest & { mood?: string }, relatedMemories: string[] = []) {
    return [
      'Eres el motor de coherencia artística de BELENTANI.',
      `Solicitud: ${request.prompt}`,
      request.mood ? `Mood: ${request.mood}` : '',
      `Número de canciones: ${request.songCount}`,
      relatedMemories.length > 0 ? `Preferencias relacionadas guardadas localmente: ${relatedMemories.join(' | ')}` : '',
      'Devuelve únicamente JSON con songs, convergenceScore, narrativeArc y recommendations.',
      'Cada canción debe incluir songTitle, artist, reason, emotionalLayer, artisticProgression y vibeScore.',
    ].filter(Boolean).join('\n');
  }

  private parseResponse(text: string, prompt: string): ValidatedQuantumPlaylistResponse {
    try {
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) return fallbackResponse(prompt);
      return parseQuantumPlaylistResponse(JSON.parse(match[0])) ?? fallbackResponse(prompt);
    } catch {
      return fallbackResponse(prompt);
    }
  }
}

let instance: QuantumGeminiService | null = null;

export const initializeQuantumGemini = (apiKey?: string) => {
  instance ??= new QuantumGeminiService(apiKey ?? import.meta.env.VITE_GEMINI_API_KEY, import.meta.env.VITE_GEMINI_MODEL);
  return instance;
};

export const getQuantumGemini = () => {
  instance ??= initializeQuantumGemini();
  return instance;
};

export default QuantumGeminiService;
