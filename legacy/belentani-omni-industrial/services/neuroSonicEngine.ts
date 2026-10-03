export interface SonicProfile {
  energy: number;
  warmth: number;
  darkness: number;
  novelty: number;
  danceability: number;
  acousticness: number;
  tags: string[];
}

export interface CandidateTrack {
  title: string;
  artist: string;
  tags?: string[];
  profile?: Partial<SonicProfile>;
}

const lexicon: Record<string, Partial<SonicProfile>> = {
  noche: { darkness: 0.8, warmth: 0.4 }, nocturna: { darkness: 0.85, warmth: 0.4 },
  calm: { energy: 0.2, warmth: 0.6 }, calma: { energy: 0.2, warmth: 0.6 },
  energía: { energy: 0.9, danceability: 0.8 }, energia: { energy: 0.9, danceability: 0.8 },
  fiesta: { energy: 0.85, danceability: 0.9 }, baile: { danceability: 0.9, energy: 0.8 },
  triste: { darkness: 0.7, energy: 0.25, warmth: 0.35 }, melancólico: { darkness: 0.65, warmth: 0.3 },
  luminoso: { warmth: 0.9, darkness: 0.1 }, solar: { warmth: 0.9, energy: 0.65 },
  acústico: { acousticness: 0.9, warmth: 0.75 }, organico: { acousticness: 0.85, warmth: 0.7 }, orgánico: { acousticness: 0.85, warmth: 0.7 },
  electrónico: { acousticness: 0.1, novelty: 0.55 }, electronica: { acousticness: 0.1, novelty: 0.55 }, electrónica: { acousticness: 0.1, novelty: 0.55 },
  cyberpunk: { darkness: 0.8, novelty: 0.9, energy: 0.7 }, espacial: { darkness: 0.65, novelty: 0.85, energy: 0.35 },
  jazz: { warmth: 0.7, novelty: 0.6, acousticness: 0.7 }, lofi: { energy: 0.25, warmth: 0.7, acousticness: 0.45 },
};

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export const analyzeSonicIntent = (prompt: string): SonicProfile => {
  const normalized = prompt.toLowerCase();
  const base: SonicProfile = { energy: 0.5, warmth: 0.5, darkness: 0.35, novelty: 0.5, danceability: 0.4, acousticness: 0.45, tags: [] };
  const matched: string[] = [];
  for (const [term, profile] of Object.entries(lexicon)) {
    if (!normalized.includes(term)) continue;
    matched.push(term);
    for (const key of ['energy', 'warmth', 'darkness', 'novelty', 'danceability', 'acousticness'] as const) {
      if (profile[key] !== undefined) base[key] = clamp((base[key] + profile[key]!) / 2);
    }
  }
  return { ...base, tags: matched };
};

export const scoreCandidate = (candidate: CandidateTrack, target: SonicProfile) => {
  const profile: SonicProfile = {
    ...target,
    ...candidate.profile,
    tags: candidate.tags ?? [],
  };
  const distance = ['energy', 'warmth', 'darkness', 'novelty', 'danceability', 'acousticness'].reduce((sum, key) => {
    const value = profile[key as keyof SonicProfile] as number;
    const targetValue = target[key as keyof SonicProfile] as number;
    return sum + Math.abs(value - targetValue);
  }, 0);
  const tagBonus = (candidate.tags ?? []).filter((tag) => target.tags.includes(tag.toLowerCase())).length * 0.04;
  return clamp(1 - distance / 6 + tagBonus);
};

export const rankCandidates = (candidates: CandidateTrack[], target: SonicProfile) => candidates
  .map((candidate) => ({ candidate, score: scoreCandidate(candidate, target) }))
  .sort((left, right) => right.score - left.score);

export const buildNarrativeArc = (profile: SonicProfile) => {
  const opening = profile.darkness > 0.6 ? 'una apertura introspectiva' : 'una apertura luminosa';
  const middle = profile.energy > 0.65 ? 'un ascenso cinético' : 'una deriva progresiva';
  const closing = profile.warmth > 0.65 ? 'una resolución cálida' : 'un cierre abierto';
  return `${opening}, ${middle} y ${closing}.`;
};
