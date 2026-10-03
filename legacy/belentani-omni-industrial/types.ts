export type SubscriptionTier = 'free' | 'premium' | 'admin';

export interface Playlist {
  readonly name: string;
  readonly songs: readonly string[];
  readonly id?: string;
}

export interface PlaylistRequest {
  readonly prompt: string;
  readonly songCount: number;
  readonly mood?: string;
}

export interface PlaylistSynthesisPayload {
  readonly prompt: string;
  readonly constraints?: Readonly<Record<string, string | number | boolean>>;
}

export interface ExplainDecisionPayload {
  readonly prompt: string;
}

export interface PrivacyAuditPayload {
  readonly source?: string;
}

export interface QueueOptimizationPayload {
  readonly items: readonly string[];
}

export interface HealthCheckPayload {
  readonly source?: string;
  readonly message?: string;
  readonly componentStack?: string;
}

export interface OmniPayloadMap {
  readonly playlist_synthesis: PlaylistSynthesisPayload;
  readonly explain_decision: ExplainDecisionPayload;
  readonly privacy_audit: PrivacyAuditPayload;
  readonly queue_optimization: QueueOptimizationPayload;
  readonly health_check: HealthCheckPayload;
}

export type OmniTaskKind = keyof OmniPayloadMap;
export type OmniPriority = 1 | 2 | 3 | 4 | 5;
export type OmniTaskPayload<K extends OmniTaskKind> = OmniPayloadMap[K];
