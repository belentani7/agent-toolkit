import { afterEach, describe, expect, it, vi } from "vitest";
import { openPvcRealtimeStream } from "./pvcu-realtime";

class FakeEventSource {
  static latest: FakeEventSource | undefined;
  readonly url: string;
  readonly listeners = new Map<string, (event: Event) => void>();
  readonly removeCalls: string[] = [];
  closed = false;
  onerror: (() => void) | null = null;

  constructor(url: string) {
    this.url = url;
    FakeEventSource.latest = this;
  }

  addEventListener(name: string, listener: (event: Event) => void) {
    this.listeners.set(name, listener);
  }

  removeEventListener(name: string) {
    this.removeCalls.push(name);
    this.listeners.delete(name);
  }

  close() {
    this.closed = true;
  }

  emit(name: string, event: Event = new Event(name)) {
    this.listeners.get(name)?.(event);
  }
}

afterEach(() => {
  vi.unstubAllGlobals();
  FakeEventSource.latest = undefined;
});

describe("PVC-U frontend realtime adapter", () => {
  it("opens a scoped stream, handles ready/outbox/error and closes cleanly", () => {
    vi.stubGlobal("EventSource", FakeEventSource);
    const statuses: string[] = [];
    const events: unknown[] = [];
    const cleanup = openPvcRealtimeStream("tenant/a", { onStatus: (status) => statuses.push(status), onEvent: (event) => events.push(event) });
    const stream = FakeEventSource.latest;

    expect(stream?.url).toBe("/api/pvcu/stream?tenantKey=tenant%2Fa");
    expect(statuses).toEqual(["connecting"]);
    stream?.emit("ready");
    stream?.emit("pvc.outbox", new MessageEvent("pvc.outbox", { data: JSON.stringify({ eventId: "evt-1" }) }));
    stream?.emit("pvc.outbox", new MessageEvent("pvc.outbox", { data: "not-json" }));
    stream!.onerror?.();
    cleanup();

    expect(statuses).toEqual(["connecting", "connected", "degraded"]);
    expect(events).toEqual([{ eventId: "evt-1" }, {}]);
    expect(stream?.removeCalls).toEqual(["ready", "pvc.outbox"]);
    expect(stream?.closed).toBe(true);
  });
});
