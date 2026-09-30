// ─────────────────────────────────────────────────────────────
// Configuración central de la app (despliegue estático / GitHub Pages)
// ─────────────────────────────────────────────────────────────
export const APP_CONFIG = {
  name: "Bitcoin Portfolio Analyzer",
  shortName: "Portfolio Analyzer",
  tagline: "Personal investment intelligence",
  // "hash"    → recomendado para GitHub Pages (no requiere configuración de servidor)
  // "browser" → rutas limpias, requiere un public/404.html que redirija a index.html
  routerMode: "hash",
  // Base de assets públicos. Ajustar al nombre final del repositorio si se usa
  // una ruta absoluta (p. ej. "/bitcoin-portfolio-analyzer/"). "./" = relativo.
  basePath: "./",
  locale: "en-US",
  currency: "USD",
};

export const asset = (path) => `${APP_CONFIG.basePath}${path.replace(/^\//, "")}`;