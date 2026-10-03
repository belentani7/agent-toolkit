import { z } from 'zod';

const boundedText = (maximum: number) => z.string().trim().min(1).max(maximum);

export const PlaylistRequestSchema = z.object({
  prompt: boundedText(800),
  songCount: z.number().int().min(1).max(100),
  mood: z.string().trim().min(1).max(120).optional(),
}).strict();

export type ValidatedPlaylistRequest = z.infer<typeof PlaylistRequestSchema>;

export const ArtisticDecisionSchema = z.object({
  songTitle: boundedText(240),
  artist: boundedText(240),
  reason: boundedText(800),
  emotionalLayer: boundedText(300),
  artisticProgression: boundedText(500),
  vibeScore: z.preprocess((value) => typeof value === 'string' || typeof value === 'number' ? Number(value) : value, z.number().finite().min(0).max(100)),
}).strip();

export const QuantumPlaylistResponseSchema = z.object({
  songs: z.array(ArtisticDecisionSchema).max(100),
  convergenceScore: z.preprocess((value) => typeof value === 'string' || typeof value === 'number' ? Number(value) : value, z.number().finite().min(0).max(100)),
  narrativeArc: boundedText(1_200),
  recommendations: z.array(boundedText(500)).max(20),
}).strip();

export type ValidatedQuantumPlaylistResponse = z.infer<typeof QuantumPlaylistResponseSchema>;

export const OmniTaskInputSchema = z.object({
  kind: z.enum(['playlist_synthesis', 'explain_decision', 'privacy_audit', 'queue_optimization', 'health_check']),
  priority: z.number().int().min(1).max(5).default(3),
  payload: z.record(z.string(), z.unknown()).default({}),
}).strict();

export const InteroperablePlaylistSchema = z.object({
  schema: z.literal('belentani.playlist'),
  version: z.literal(1),
  exportedAt: z.string().datetime(),
  title: boundedText(240),
  songs: z.array(boundedText(240)).max(500),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
}).strict();

export const parseQuantumPlaylistResponse = (input: unknown): ValidatedQuantumPlaylistResponse | null => {
  const result = QuantumPlaylistResponseSchema.safeParse(input);
  return result.success ? result.data : null;
};

export const parsePlaylistRequest = (input: unknown): ValidatedPlaylistRequest | null => {
  const result = PlaylistRequestSchema.safeParse(input);
  return result.success ? result.data : null;
};
