import { afterEach, describe, expect, it, vi } from "vitest";
import { registerChatStreamRoute } from "./chatStream";

type Handler = (req: any, res: any) => Promise<void>;

function createApp() {
  let postHandler: Handler | undefined;
  let getHandler: Handler | undefined;
  return {
    post: (_path: string, handler: Handler) => { postHandler = handler; },
    get: (_path: string, handler: Handler) => { getHandler = handler; },
    handlers: () => ({ postHandler, getHandler }),
  } as any;
}

function createResponse() {
  const headers = new Map<string, string>();
  const chunks: string[] = [];
  let statusCode = 200;
  let body: unknown;
  let writableEnded = false;
  return {
    get statusCode() { return statusCode; },
    get body() { return body; },
    get chunks() { return chunks; },
    get headers() { return headers; },
    get writableEnded() { return writableEnded; },
    headersSent: false,
    status(code: number) { statusCode = code; return this; },
    json(payload: unknown) { body = payload; return this; },
    setHeader(name: string, value: string) { headers.set(name.toLowerCase(), value); return this; },
    flushHeaders() { this.headersSent = true; },
    write(chunk: Buffer | string) { chunks.push(Buffer.isBuffer(chunk) ? chunk.toString("utf8") : chunk); this.headersSent = true; return true; },
    end() { writableEnded = true; },
    on() { return this; },
    removeListener() { return this; },
  } as any;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("chat stream integration", () => {
  it("proxies SSE progressively and propagates the traceId", async () => {
    const app = createApp();
    registerChatStreamRoute(app);
    const { postHandler } = app.handlers();
    const upstream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('data: {"choices":[{"delta":{"content":"Hola"}}]}\n\n'));
        controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
        controller.close();
      },
    });
    const fetchMock = vi.fn().mockResolvedValue(new Response(upstream, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const response = createResponse();
    await postHandler?.({
      body: { clientVersion: "1.0.0", messages: [{ role: "user", content: "Hola" }] },
      headers: { "x-trace-id": "trace-test" },
      header: (name: string) => name === "x-trace-id" ? "trace-test" : undefined,
    }, response);

    expect(response.statusCode).toBe(200);
    expect(response.headers.get("x-trace-id")).toBe("trace-test");
    expect(response.chunks.join("")).toContain('"content":"Hola"');
    const requestBody = JSON.parse(fetchMock.mock.calls[0]?.[1]?.body as string);
    expect(requestBody.messages[0].role).toBe("system");
    expect(requestBody.messages[1]).toEqual({ role: "user", content: "Hola" });
  });

  it("returns a PVC-502 envelope when the model provider fails", async () => {
    const app = createApp();
    registerChatStreamRoute(app);
    const { postHandler } = app.handlers();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("provider unavailable", { status: 503 })));

    const response = createResponse();
    await postHandler?.({
      body: { messages: [{ role: "user", content: "Hola" }] },
      headers: {},
      header: () => undefined,
    }, response);

    expect(response.statusCode).toBe(503);
    expect(response.body).toMatchObject({
      envelope: { validationStatus: "FAILED", layer: "INFRASTRUCTURE", errors: [{ code: "PVC-502" }] },
    });
  });
});
