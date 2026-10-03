import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OmniAutonomy } from '../services/omniAutonomy';
import { embedText, omniMemory } from '../services/omniMemory';
import { generatePlaylist } from '../services/geminiService';
import { parsePlaylistRequest, parseQuantumPlaylistResponse } from '../services/validation';

const waitForCompletedTask = async (runtime: OmniAutonomy, taskId: string) => {
  await vi.waitFor(() => {
    const task = runtime.getSnapshot().queue.find((item) => item.id === taskId);
    expect(task?.status).toBe('completed');
  }, { timeout: 1_000, interval: 10 });
};

describe('contratos de validación', () => {
  it('acepta solicitudes válidas y rechaza prompt vacío o songCount fuera de rango', () => {
    expect(parsePlaylistRequest({ prompt: 'ambient nocturno', songCount: 8 })?.songCount).toBe(8);
    expect(parsePlaylistRequest({ prompt: ' ', songCount: 8 })).toBeNull();
    expect(parsePlaylistRequest({ prompt: 'ambient', songCount: 101 })).toBeNull();
  });

  it('normaliza números de respuesta y rechaza estructuras incompletas', () => {
    const result = parseQuantumPlaylistResponse({
      songs: [{
        songTitle: 'Amber Horizon',
        artist: 'BELENTANI Session',
        reason: 'Contraste cálido',
        emotionalLayer: 'Calma',
        artisticProgression: 'Resolución',
        vibeScore: '91',
      }],
      convergenceScore: '89',
      narrativeArc: 'Ascenso y resolución.',
      recommendations: ['Mantén transiciones suaves.'],
    });
    expect(result?.convergenceScore).toBe(89);
    expect(result?.songs[0]?.vibeScore).toBe(91);
    expect(parseQuantumPlaylistResponse({ songs: [] })).toBeNull();
  });
});

describe('memoria semántica local', () => {
  beforeEach(() => omniMemory.clear());

  it('genera embeddings deterministas con dimensión estable', () => {
    const first = embedText('electrónica cálida y nocturna');
    const second = embedText('electrónica cálida y nocturna');
    expect(first).toHaveLength(48);
    expect(first).toEqual(second);
  });

  it('deduplica recuerdos y sanitiza información personal básica', () => {
    const firstId = omniMemory.remember('Prefiero sesiones cálidas usuario@example.com', 'music', ['preference']);
    const secondId = omniMemory.remember('Prefiero sesiones cálidas usuario@example.com', 'music', ['preference']);
    expect(firstId).toBe(secondId);
    expect(omniMemory.exportMetadata().count).toBe(1);
    expect(omniMemory.recall('Prefiero sesiones cálidas', 1)[0]?.text).toContain('[email]');
  });
});

describe('runtime de autonomía controlada', () => {
  it('ejecuta health_check dentro de una capacidad registrada', async () => {
    const runtime = new OmniAutonomy();
    const taskId = runtime.enqueue('health_check', { source: 'test' }, 5);
    expect(taskId).toBeTypeOf('string');
    await waitForCompletedTask(runtime, taskId as string);
    expect(runtime.getSnapshot().completed).toBe(1);
  });

  it('respeta la parada de emergencia y no acepta nuevas tareas', () => {
    const runtime = new OmniAutonomy();
    runtime.emergencyStop();
    expect(runtime.enqueue('health_check', { source: 'blocked-test' })).toBeNull();
    expect(runtime.getSnapshot().emergencyStopped).toBe(true);
  });
});

describe('flujo de generación resiliente', () => {
  it('devuelve una playlist normalizada con fallback local sin API key', async () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', '');
    const playlist = await generatePlaylist({ prompt: 'ambient cinematográfico', songCount: 2 });
    expect(playlist.name).toContain('BELENTANI');
    expect(playlist.songs.length).toBeGreaterThan(0);
    expect(playlist.songs[0]).toContain(' — ');
  });

  it('rechaza entradas no válidas antes de invocar el motor', async () => {
    await expect(generatePlaylist({ prompt: '', songCount: 2 })).rejects.toThrow('solicitud');
  });
});
