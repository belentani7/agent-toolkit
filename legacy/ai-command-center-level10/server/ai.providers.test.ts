import { describe, expect, it } from "vitest";
import { getProviderStatuses, runChat } from "./ai/providers";

describe("AI provider bridge", () => {
  it("exposes a truthful provider catalog without leaking secrets", () => {
    const statuses = getProviderStatuses();
    const ids = statuses.map((status) => status.id);

    expect(ids).toEqual([
      "demo",
      "ollama",
      "lmstudio",
      "llamacpp",
      "openai",
      "anthropic",
      "google",
      "openrouter",
    ]);
    expect(statuses.every((status) => !("apiKey" in status))).toBe(true);
    expect(statuses.find((status) => status.id === "demo")).toMatchObject({
      configured: true,
      requiresApiKey: false,
    });
  });

  it("does not call a model in demo mode", async () => {
    const result = await runChat({
      provider: "demo",
      model: "no-model",
      messages: [{ role: "user", content: "Hola" }],
    });

    expect(result.provider).toBe("demo");
    expect(result.content).toContain("no se ha llamado a ningún modelo");
  });

  it("rejects non-loopback custom endpoints", async () => {
    await expect(runChat({
      provider: "lmstudio",
      model: "local-model",
      baseUrl: "https://example.com/v1",
      messages: [{ role: "user", content: "No debe salir a Internet" }],
    })).rejects.toThrow("debe apuntar a localhost");
  });
});
