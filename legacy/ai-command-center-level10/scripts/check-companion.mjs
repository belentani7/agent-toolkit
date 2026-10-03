import assert from "node:assert/strict";
import { startCompanion } from "../local-companion/server.mjs";

process.env.COMPANION_TOKEN = "test-secret-token";

const server = await startCompanion({ host: "127.0.0.1", port: 0 });
const address = server.address();
const baseUrl = `http://127.0.0.1:${address.port}`;

try {
  const unauthorized = await fetch(`${baseUrl}/healthz`);
  assert.equal(unauthorized.status, 401);

  const health = await fetch(`${baseUrl}/healthz`, {
    headers: { authorization: "Bearer test-secret-token", origin: "http://localhost:3000" },
  }).then((response) => response.json());
  assert.equal(health.ok, true);

  const badOrigin = await fetch(`${baseUrl}/healthz`, {
    headers: { authorization: "Bearer test-secret-token", origin: "https://evil.com" },
  });
  assert.equal(badOrigin.status, 403);

  const providers = await fetch(`${baseUrl}/v1/providers`, {
    headers: { authorization: "Bearer test-secret-token", origin: "http://localhost:3000" },
  }).then((response) => response.json());
  assert.equal(Array.isArray(providers.data), true);
  assert.equal(providers.data.some((provider) => provider.id === "ollama"), true);

  const demo = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: "Bearer test-secret-token", origin: "http://localhost:3000" },
    body: JSON.stringify({ provider: "demo", model: "no-model", messages: [{ role: "user", content: "Prueba" }] }),
  }).then((response) => response.json());
  assert.match(demo.choices[0].message.content, /Modo demostración/);

  const blocked = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: "Bearer test-secret-token", origin: "http://localhost:3000" },
    body: JSON.stringify({ provider: "lmstudio", model: "local-model", baseUrl: "https://example.com/v1", messages: [{ role: "user", content: "No" }] }),
  }).then((response) => response.json());
  assert.match(blocked.error, /debe ser local/);

  console.log("Companion security and auth check: OK");
} finally {
  delete process.env.COMPANION_TOKEN;
  await new Promise((resolve) => server.close(resolve));
}
