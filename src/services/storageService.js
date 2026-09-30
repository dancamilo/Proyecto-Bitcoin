// ─────────────────────────────────────────────────────────────
// STORAGE SEAM (punto 10 del encargo) — único punto de acceso a
// localStorage. Si en el futuro se quiere migrar a Firebase, Supabase,
// IndexedDB, etc., solo hay que reescribir este archivo: nada fuera de
// aquí llama a `localStorage` directamente.
//
// Robustez (punto 20): si localStorage no existe (modo privado agresivo),
// está lleno, o contiene JSON corrupto, todas las funciones devuelven un
// valor por defecto seguro en vez de lanzar un error que rompa la app.
// ─────────────────────────────────────────────────────────────

const KEYS = {
  transactions: "btc-analyzer:transactions:v1",
  feeSettings: "btc-analyzer:fee-settings:v1",
  preferences: "btc-analyzer:preferences:v1",
  marketCache: "btc-analyzer:market-cache:v1",
};

function safeGet(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    // JSON corrupto o localStorage inaccesible: no reventar la app.
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    // Cuota excedida, modo privado, etc. La UI debe seguir funcionando
    // (los cambios simplemente no persistirán entre sesiones).
    return false;
  }
}

const uid = () => `tx_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

// ── Operaciones (compras/ventas) ────────────────────────────
export function getTransactions() {
  const list = safeGet(KEYS.transactions, []);
  return Array.isArray(list) ? list : [];
}

export function addTransaction(tx) {
  const list = getTransactions();
  const record = { id: uid(), createdAt: new Date().toISOString(), ...tx };
  const next = [...list, record];
  safeSet(KEYS.transactions, next);
  return record;
}

export function updateTransaction(id, patch) {
  const list = getTransactions();
  const next = list.map((t) => (t.id === id ? { ...t, ...patch, id } : t));
  safeSet(KEYS.transactions, next);
  return next.find((t) => t.id === id) ?? null;
}

export function deleteTransaction(id) {
  const list = getTransactions();
  const next = list.filter((t) => t.id !== id);
  safeSet(KEYS.transactions, next);
  return next;
}

// ── Plan de comisiones (punto 11) ───────────────────────────
export const FEE_PLAN_PRESETS = [
  { id: "standard", name: "Standard", rate: 0.3, min: 0.01, mode: "deduct", description: "Configuración por defecto para operaciones regulares." },
  { id: "reduced", name: "Reducida", rate: 0.15, min: 0.01, mode: "deduct", description: "Ejemplo de plan con comisión menor." },
  { id: "custom", name: "Personalizada", rate: 0.3, min: 0.01, mode: "deduct", description: "Define tu propio porcentaje, mínimo y modo de cobro." },
];
const DEFAULT_FEE_SETTINGS = { activePlanId: "standard", customRate: 0.3, customMin: 0.01, customMode: "deduct" };

export function getFeeSettings() {
  const saved = safeGet(KEYS.feeSettings, null);
  if (!saved || typeof saved !== "object") return DEFAULT_FEE_SETTINGS;
  return { ...DEFAULT_FEE_SETTINGS, ...saved };
}

export function setFeeSettings(settings) {
  const next = { ...getFeeSettings(), ...settings };
  safeSet(KEYS.feeSettings, next);
  return next;
}

/** Devuelve el plan de comisión activo, ya resuelto (con rate/min/mode reales). */
export function getActiveFeePlan() {
  const settings = getFeeSettings();
  const preset = FEE_PLAN_PRESETS.find((p) => p.id === settings.activePlanId) ?? FEE_PLAN_PRESETS[0];
  if (preset.id !== "custom") return preset;
  return { ...preset, rate: settings.customRate, min: settings.customMin, mode: settings.customMode };
}

// ── Preferencias ─────────────────────────────────────────────
const DEFAULT_PREFERENCES = { hideBalances: false, autoRefresh: true, refreshIntervalMs: 60_000 };

export function getPreferences() {
  const saved = safeGet(KEYS.preferences, null);
  if (!saved || typeof saved !== "object") return DEFAULT_PREFERENCES;
  return { ...DEFAULT_PREFERENCES, ...saved };
}

export function setPreferences(patch) {
  const next = { ...getPreferences(), ...patch };
  safeSet(KEYS.preferences, next);
  return next;
}

// ── Caché de mercado (fallback offline, punto 6 y 20) ───────
// Guarda el último dato de mercado válido para poder mostrar algo con
// sentido si la API falla o no hay conexión al recargar la página.
export function getCachedMarket() {
  return safeGet(KEYS.marketCache, null);
}

export function setCachedMarket(snapshot) {
  safeSet(KEYS.marketCache, { ...snapshot, cachedAt: new Date().toISOString() });
}
