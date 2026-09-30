import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import PageNotFound from "@/lib/PageNotFound";
import ScrollToTop from "@/components/ScrollToTop";
import { APP_CONFIG } from "@/config/app";
import AppLayout from "@/components/navigation/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Market from "@/pages/Market";
import Transactions from "@/pages/Transactions";
import Analysis from "@/pages/Analysis";
import Dca from "@/pages/Dca";
import Education from "@/pages/Education";
import Settings from "@/pages/Settings";

// "hash" (por defecto) funciona en cualquier subruta de GitHub Pages sin
// configuración adicional. Cambiar a "browser" da rutas limpias (/mercado en
// vez de /#/mercado) pero requiere servir un 404.html que redirija a
// index.html — ver README.md.
const Router = APP_CONFIG.routerMode === "hash" ? HashRouter : BrowserRouter;

// App 100% cliente: no hay backend ni cuentas de usuario. Todos los datos
// (operaciones, comisiones, preferencias) viven en el localStorage del
// propio navegador — ver src/services/storageService.js.
function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/mercado" element={<Market />} />
            <Route path="/operaciones" element={<Transactions />} />
            <Route path="/analisis" element={<Analysis />} />
            <Route path="/dca" element={<Dca />} />
            <Route path="/educacion" element={<Education />} />
            <Route path="/ajustes" element={<Settings />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
