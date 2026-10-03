import { defineConfig } from "vitest/config";
import path from "path";

const templateRoot = path.resolve(import.meta.dirname);

export default defineConfig({
  root: templateRoot,
  resolve: {
    alias: {
      "@": path.resolve(templateRoot, "client", "src"),
      "@shared": path.resolve(templateRoot, "shared"),
      "@assets": path.resolve(templateRoot, "attached_assets"),
    },
  },
  test: {
    environment: "node",
    environmentMatchGlobs: [["client/**/*.test.ts", "jsdom"], ["client/**/*.test.tsx", "jsdom"], ["client/**/*.spec.ts", "jsdom"], ["client/**/*.spec.tsx", "jsdom"]],
    include: ["server/**/*.test.ts", "server/**/*.spec.ts", "client/**/*.test.ts", "client/**/*.test.tsx", "client/**/*.spec.ts", "client/**/*.spec.tsx"],
    coverage: {
      provider: "v8",
      include: ["server/pvcu-core.ts", "server/pvcu-db.ts", "server/routers/pvcu.ts", "server/realtime.ts", "client/src/lib/pvcu-realtime.ts"],
      reporter: ["text", "json-summary", "html"],
      reportsDirectory: "coverage",
    },
  },
});
