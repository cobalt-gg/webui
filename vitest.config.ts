import { defineConfig } from "vitest/config";
export default defineConfig({
  resolve: {
    alias: {
      "@cobalt/ui/registry": new URL("./src/registry.ts", import.meta.url).pathname,
      "@cobalt/ui": new URL("./src/index.ts", import.meta.url).pathname,
    },
  },
  test: { environment: "jsdom", include: ["tests/**/*.test.tsx"], setupFiles: ["tests/setup.ts"] },
});
