import { describe, expect, it } from "vitest";
import { registerChatStreamRoute } from "./chatStream";

type Handler = (req: any, res: any) => Promise<void>;

describe("chat stream endpoint", () => {
  it("returns a Spanish validation error when no messages are provided", async () => {
    let handler: Handler | undefined;
    const app = {
      post: (_path: string, callback: Handler) => {
        handler = callback;
      },
      get: () => undefined,
    } as any;

    registerChatStreamRoute(app);

    const response = {
      statusCode: 200,
      body: null as unknown,
      status(code: number) {
        this.statusCode = code;
        return this;
      },
      json(payload: unknown) {
        this.body = payload;
      },
    };

    await handler?.({ body: {} }, response);

    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({
      error: "Invalid input: expected array, received undefined",
      envelope: {
        validationStatus: "FAILED",
        layer: "PRESENTATION",
        errors: [{ code: "PVC-101", field: "messages" }],
      },
    });
  });
});
