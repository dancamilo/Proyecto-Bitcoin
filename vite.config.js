import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// ─────────────────────────────────────────────────────────────
// Config de build para GitHub Pages.
//
// `base`: GitHub Pages sirve un "project site" en
// https://usuario.github.io/repositorio/ (una subruta), así que las URLs
// de los assets generados deben ser relativas para funcionar sin importar
// el nombre del repositorio. Combinado con HashRouter (ver src/config/app.js)
// esto hace que la app funcione igual en local, en una subcarpeta de GitHub
// Pages, o abierta directamente desde el sistema de archivos.
//
// Si en cambio prefieres BrowserRouter + rutas limpias, cambia `base` a
// "/nombre-de-tu-repo/" y añade un public/404.html que redirija a index.html
// (el truco estándar de SPA en GitHub Pages). Ver README.md.
export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
  server: {
    port: 5173,
  },
});
