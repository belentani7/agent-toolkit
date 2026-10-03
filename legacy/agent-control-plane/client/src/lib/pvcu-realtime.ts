export type PvcRealtimeStatus = "connecting" | "connected" | "degraded";
export type PvcRealtimeEvent = { eventId?: string; eventType?: string; aggregateId?: string; status?: string; eventHash?: string };

type PvcRealtimeCallbacks = {
  onStatus: (status: PvcRealtimeStatus) => void;
  onEvent: (event: PvcRealtimeEvent) => void;
};

export function openPvcRealtimeStream(tenantKey: string, callbacks: PvcRealtimeCallbacks) {
  callbacks.onStatus("connecting");
  const stream = new EventSource(`/api/pvcu/stream?tenantKey=${encodeURIComponent(tenantKey)}`);
  const handleReady = () => callbacks.onStatus("connected");
  const handleOutbox = (event: Event) => {
    try {
      callbacks.onEvent(JSON.parse((event as MessageEvent<string>).data) as PvcRealtimeEvent);
    } catch {
      callbacks.onEvent({});
    }
  };
  stream.addEventListener("ready", handleReady);
  stream.addEventListener("pvc.outbox", handleOutbox);
  stream.onerror = () => callbacks.onStatus("degraded");
  return () => {
    stream.removeEventListener("ready", handleReady);
    stream.removeEventListener("pvc.outbox", handleOutbox);
    stream.close();
  };
}
