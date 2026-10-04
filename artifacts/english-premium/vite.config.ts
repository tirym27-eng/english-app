import { defineConfig } from "vite";

const rawPort = process.env.PORT || "5173";
const port = Number(rawPort);
const basePath = process.env.BASE_PATH || "/";

export default defineConfig({
  base: basePath,
  root: __dirname,
  build: { outDir: "dist/public", emptyOutDir: true },
  server: { port, strictPort: true, host: "0.0.0.0", allowedHosts: true },
  preview: { port, host: "0.0.0.0", allowedHosts: true },
});
