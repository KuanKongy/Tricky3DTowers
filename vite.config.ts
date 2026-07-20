import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Repo name — required so assets resolve under kuankongy.github.io/Tricky3DTowers/
  base: "/Tricky3DTowers/",
  plugins: [react()],
  optimizeDeps: {
    exclude: ["@dimforge/rapier3d-compat"],
  },
  build: {
    target: "esnext",
    sourcemap: true,
  },
  server: {
    port: 5173,
    host: true,
  },
});
