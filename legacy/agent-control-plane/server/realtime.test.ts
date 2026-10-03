import { describe, expect, it, vi } from "vitest";

const { contextMock, tenantMock, outboxMock } = vi.hoisted(() => ({
  contextMock: vi.fn(),
  tenantMock: vi.fn(),
  outboxMock: vi.fn(),
}));

vi.mock("./_core/context", () => ({ createContext: contextMock }));
vi.mock("./pvcu-db", () => ({ getPvcTenant: tenantMock, listPvcOutbox: outboxMock }));

import { beforeEach } from "vitest";
import { formatSseEvent, pollPvcOutbox, registerPvcRealtimeRoutes } from "./realtime";

type FakeResponse = {
  status: ReturnType<typeof vi.fn>;
  json: ReturnType<typeof vi.fn>;
  set: ReturnType<typeof vi.fn>;
  flushHeaders: ReturnType<typeof vi.fn>;
  write: ReturnType<typeof vi.fn>;
};

function createRouteHarness() {
  let handler: ((request: unknown, response: FakeResponse) => Promise<void>) | undefined;
  let closeHandler: (() => void) | undefined;
  const app = { get: vi.fn((_path: string, routeHandler: typeof handler) => { handler = routeHandler; }) };
  const response = {
    status: vi.fn(() => response),
    json: vi.fn(() => response),
    set: vi.fn(() => response),
    flushHeaders: vi.fn(),
    write: vi.fn(),
  } as FakeResponse;
  const request = {
    query: { tenantKey: "tenant-a" },
    on: vi.fn((event: string, callback: () => void) => {
      if (event === "close") closeHandler = callback;
      return request;
    }),
  };
  return { app, request, response, getHandler: () => handler, getClose: () => closeHandler };
}

describe("PVC-U realtime SSE contract", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns without polling when the SSE stream is already closed", async () => {
    const write = vi.fn();
    await pollPvcOutbox("tenant-a", { isClosed: () => true, seen: new Set(), write });
    expect(outboxMock).not.toHaveBeenCalled();
    expect(write).not.toHaveBeenCalled();
  });

  it("formats named events with id and JSON data terminated for EventSource", () => {
    expect(formatSseEvent("pvc.outbox", { eventId: "evt-1", eventHash: "a".repeat(64) }, "evt-1")).toBe(
      `event: pvc.outbox\nid: evt-1\ndata: {"eventId":"evt-1","eventHash":"${"a".repeat(64)}"}\n\n`,
    );
  });

  it("authenticates, enforces tenant scope, emits heartbeat, deduplicates, closes and supports reconnect", async () => {
    vi.useFakeTimers();
    contextMock.mockResolvedValue({ user: { openId: "owner-a", role: "user" } });
    tenantMock.mockResolvedValue({ tenantKey: "tenant-a", ownerOpenId: "owner-a" });
    outboxMock.mockResolvedValue([{ eventId: "evt-1", eventType: "pvc.validation.recorded", aggregateId: "val-1", status: "pending", eventHash: "a".repeat(64), createdAt: new Date() }]);

    const first = createRouteHarness();
    registerPvcRealtimeRoutes(first.app as never);
    const route = first.getHandler();
    expect(route).toBeTypeOf("function");
    await route?.(first.request, first.response);
    await vi.runOnlyPendingTimersAsync();

    expect(first.app.get).toHaveBeenCalledWith("/api/pvcu/stream", expect.any(Function));
    expect(first.response.set).toHaveBeenCalledWith(expect.objectContaining({ "Content-Type": "text/event-stream" }));
    expect(first.response.write).toHaveBeenCalledWith(expect.stringContaining("event: ready"));
    expect(first.response.write).toHaveBeenCalledWith(expect.stringContaining("event: pvc.outbox"));

    const writesBeforeHeartbeat = first.response.write.mock.calls.length;
    await vi.advanceTimersByTimeAsync(15_000);
    expect(first.response.write.mock.calls.length).toBeGreaterThan(writesBeforeHeartbeat);
    expect(first.response.write).toHaveBeenCalledWith(": heartbeat\n\n");

    const writesBeforeDuplicatePoll = first.response.write.mock.calls.length;
    await vi.advanceTimersByTimeAsync(3_000);
    expect(first.response.write.mock.calls.length).toBe(writesBeforeDuplicatePoll);

    first.getClose()?.();
    const writesAfterClose = first.response.write.mock.calls.length;
    await vi.advanceTimersByTimeAsync(15_000);
    expect(first.response.write.mock.calls.length).toBe(writesAfterClose);

    const second = createRouteHarness();
    registerPvcRealtimeRoutes(second.app as never);
    const reconnectRoute = second.getHandler();
    await reconnectRoute?.(second.request, second.response);
    await vi.runOnlyPendingTimersAsync();
    expect(second.response.write).toHaveBeenCalledWith(expect.stringContaining("event: pvc.outbox"));
    expect(tenantMock).toHaveBeenCalledWith("tenant-a", "owner-a", false);
    vi.useRealTimers();
  });

  it("rejects missing or non-scalar tenant keys before opening a stream", async () => {
    contextMock.mockResolvedValue({ user: { openId: "owner-a", role: "user" } });
    const missing = createRouteHarness();
    missing.request.query = {};
    registerPvcRealtimeRoutes(missing.app as never);
    await missing.getHandler()?.(missing.request, missing.response);
    expect(missing.response.status).toHaveBeenCalledWith(400);
    expect(missing.response.json).toHaveBeenCalledWith({ error: "tenantKey is required" });

    const nonScalar = createRouteHarness();
    nonScalar.request.query.tenantKey = ["tenant-a"] as never;
    registerPvcRealtimeRoutes(nonScalar.app as never);
    await nonScalar.getHandler()?.(nonScalar.request, nonScalar.response);
    expect(nonScalar.response.status).toHaveBeenCalledWith(400);
    expect(tenantMock).not.toHaveBeenCalled();
  });

  it("rejects a tenant outside the authenticated scope", async () => {
    contextMock.mockResolvedValue({ user: { openId: "owner-a", role: "user" } });
    tenantMock.mockResolvedValueOnce(undefined);
    const harness = createRouteHarness();
    registerPvcRealtimeRoutes(harness.app as never);
    await harness.getHandler()?.(harness.request, harness.response);
    expect(harness.response.status).toHaveBeenCalledWith(403);
    expect(harness.response.json).toHaveBeenCalledWith({ error: "Tenant scope is not available" });
  });

  it("emits a retryable SSE error when the outbox poll fails", async () => {
    vi.useFakeTimers();
    contextMock.mockResolvedValue({ user: { openId: "owner-a", role: "user" } });
    tenantMock.mockResolvedValue({ tenantKey: "tenant-a", ownerOpenId: "owner-a" });
    outboxMock.mockRejectedValueOnce(new Error("outbox unavailable"));
    const harness = createRouteHarness();
    registerPvcRealtimeRoutes(harness.app as never);
    await harness.getHandler()?.(harness.request, harness.response);
    await vi.runOnlyPendingTimersAsync();
    expect(harness.response.write).toHaveBeenCalledWith(expect.stringContaining('"code":"OUTBOX_UNAVAILABLE"'));
    harness.getClose()?.();
    vi.useRealTimers();
  });

  it("rejects unauthenticated clients before opening a stream", async () => {
    tenantMock.mockClear();
    contextMock.mockResolvedValueOnce({ user: null });
    const harness = createRouteHarness();
    registerPvcRealtimeRoutes(harness.app as never);
    await harness.getHandler()?.(harness.request, harness.response);
    expect(harness.response.status).toHaveBeenCalledWith(401);
    expect(harness.response.json).toHaveBeenCalledWith({ error: "Authentication required" });
    expect(tenantMock).not.toHaveBeenCalled();
  });
});
