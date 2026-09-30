# Bitcoin Portfolio Analyzer

Aplicación frontend (React + Vite) para controlar y analizar una inversión personal en Bitcoin: precio en vivo, registro de compras/ventas, cálculo de comisiones, coste promedio, P/L realizado y no realizado, simulador DCA y escenarios históricos.

100% cliente: no hay backend ni cuentas de usuario. Los datos de tus operaciones viven únicamente en el `localStorage` de tu propio navegador.

## Instalación y desarrollo

```bash
npm install
npm run dev
```

## Tests

La lógica financiera (comisiones, compra, venta, coste promedio, DCA) tiene tests unitarios que no requieren ninguna dependencia adicional (usan el test runner nativo de Node):

```bash
npm test
```

## Build de producción

```bash
npm run build
npm run preview   # para probar el build localmente
```

## Despliegue en GitHub Pages

El repo incluye `.github/workflows/deploy.yml`: cada `push` a `main` corre los tests, compila y publica `dist/` en GitHub Pages automáticamente.

Pasos:
1. Sube el repo a GitHub.
2. En **Settings → Pages**, en "Build and deployment" elige **GitHub Actions** como fuente.
3. Haz push a `main`. En unos minutos, la app estará en `https://tu-usuario.github.io/tu-repositorio/`.

La configuración por defecto (`base: "./"` en `vite.config.js` + `HashRouter`) funciona en cualquier subruta sin tocar nada, sea cual sea el nombre del repositorio. Si prefieres URLs limpias (`/mercado` en vez de `/#/mercado`), cambia en `vite.config.js` → `base: "/tu-repositorio/"`, en `src/config/app.js` → `routerMode: "browser"`, y añade un `public/404.html` que redirija a `index.html` (el truco estándar de SPA en GitHub Pages, necesario porque GitHub Pages no reescribe rutas del lado servidor).

## Fuente de datos de mercado

**CoinGecko**, API pública sin clave ("Keyless Public API" — https://docs.coingecko.com/docs/keyless-public-api). Se eligió por no requerir registro ni exponer ningún secreto en el frontend (importante: este proyecto se publica en un hosting público).

Limitaciones conocidas de este plan gratuito, documentadas para quien mantenga esto en el futuro:
- **Rate limit**: no está pensado para tráfico alto. Por eso el precio se actualiza por sondeo cada 60 segundos (configurable en Ajustes) y no en cada render.
- **Histórico**: ~1 año de profundidad. El simulador DCA a 24 meses y el escenario histórico con fecha personalizada quedan acotados a lo que la API pueda devolver; si no hay datos para el periodo pedido, la interfaz lo indica en vez de inventar un resultado.

### Cambiar de proveedor de datos

Toda la integración vive en **`src/services/marketService.js`** — es el único archivo que llama a `fetch`. Para cambiar de proveedor (por ejemplo a un plan de pago, u otra API), basta con reescribir las funciones de ese archivo manteniendo la misma forma de los datos que devuelven; nada más en la app tiene que cambiar.

## Comisiones

Configurables en **Ajustes**: porcentaje, mínimo por operación, y si se descuenta del monto introducido o se cobra además. Se guardan en `localStorage` (`src/services/storageService.js`) y se usan tanto en las estimaciones del Dashboard como al registrar una operación real.

## Cómo se calcula todo

Toda la lógica financiera está en **`src/services/calculations.js`**, funciones puras y testeadas (`tests/calculations.test.mjs`):

- **Precisión**: el dinero se maneja en centavos y el BTC en satoshis (enteros), no en floats — así las sumas nunca acumulan error de coma flotante. Ver `src/utils/money.js` para el razonamiento completo.
- **Compra**: `comisión = max(monto × %, mínimo)`. Si el modo es "descontar", el BTC se compra con `monto − comisión`; si es "adicional", se compra con el monto completo y la comisión se cobra aparte.
- **Venta**: `bruto = BTC × precio`; `comisión` igual que en compra; `neto = bruto − comisión`.
- **Coste promedio (Average Cost Basis)**: cada venta libera BTC y coste proporcionalmente al promedio de lo que había en cartera en ese momento (no es FIFO). Se eligió por ser el método más simple de auditar a mano en una cartera personal.
- **P/L realizado vs. no realizado**: realizado = resultado ya fijado al vender, frente al coste promedio que tenía la cartera en ese instante; no realizado = valor actual de lo que aún tienes, menos su coste.
- **Almacenamiento**: `src/services/storageService.js` — único punto de acceso a `localStorage` (operaciones, comisiones, preferencias). Si algún día se quiere migrar a Firebase/Supabase, solo hay que reescribir ese archivo.

## Qué queda pendiente / posibles mejoras

- No se guarda un histórico diario de "valor del portfolio": el gráfico de rendimiento valora tu tenencia **actual** de BTC contra precios históricos, no una foto día a día de cómo fue creciendo tu cartera con cada operación.
- No hay edición de operaciones ya registradas (sí borrado); para corregir una, bórrala y vuelve a registrarla.
- El plan de datos gratuito limita el histórico a ~1 año — ver sección de arriba.
- La arquitectura (`marketService`, `calculations`) está preparada para añadir más activos (ETH, SOL…) más adelante sin reescribir la app, pero deliberadamente **no** se implementó todavía (para mantener esta primera versión pequeña y confiable, tal como se pidió).

## Estructura del proyecto

```
src/
  components/   UI (dashboard, mercado, dca, analysis, transacciones, settings, ui-kit, ui de shadcn)
  hooks/        React Query: precio en vivo, histórico, operaciones, comisiones, preferencias
  services/     marketService (API), storageService (localStorage), calculations (lógica financiera)
  data/         config estática (contenido educativo, definiciones de rangos/periodos)
  pages/        una página por ruta
  charts/       tema visual compartido de los gráficos
tests/          tests unitarios de calculations.js (node --test)
```
