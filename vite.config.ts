import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

// Stamps icon links with a content hash (favicon.svg?v=1a2b3c4d) so the
// browser can't reuse a favicon it cached for the same URL — e.g. another
// app served on localhost:5173 — and picks up edits to the icon files.
function iconCacheBust(): Plugin {
  let base = "/";
  let publicDir = "";
  return {
    name: "icon-cache-bust",
    configResolved(config) {
      base = config.base;
      publicDir = config.publicDir;
    },
    transformIndexHtml: {
      // Run after Vite has resolved ./favicon.svg to <base>favicon.svg.
      order: "post",
      handler(html) {
        return html.replace(
          /(<link\b[^>]*\brel="(?:icon|apple-touch-icon)"[^>]*\bhref=")([^"?#]+)"/g,
          (match, head: string, href: string) => {
            const file = join(publicDir, href.startsWith(base) ? href.slice(base.length) : href);
            if (!existsSync(file)) return match;
            const hash = createHash("sha256").update(readFileSync(file)).digest("hex").slice(0, 8);
            return `${head}${href}?v=${hash}"`;
          },
        );
      },
    },
  };
}

export default defineConfig({
  // Repo name — required so assets resolve under kuankongy.github.io/Tricky3DTowers/
  base: "/Tricky3DTowers/",
  plugins: [react(), iconCacheBust()],
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
