import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  plugins: [react()],
  resolve: {
    alias: {
      "@cobalt/ui/styles.css": fileURLToPath(
        new URL("../src/styles/index.css", import.meta.url),
      ),
      "@cobalt/ui": fileURLToPath(new URL("../src/index.ts", import.meta.url)),
    },
  },
  build: { outDir: "dist", emptyOutDir: true },
});
