import { Outlet, useLocation } from "react-router-dom";
import { MotionConfig, motion } from "framer-motion";
import TopNav from "@/components/navigation/TopNav";
import BottomNav from "@/components/navigation/BottomNav";
import OfflineBanner from "@/components/navigation/OfflineBanner";
import AppFooter from "@/components/navigation/AppFooter";
import { EASE } from "@/charts/theme";

export default function AppLayout() {
  const { pathname } = useLocation();
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen">
        <button
          type="button"
          onClick={() => document.getElementById("main")?.focus()}
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-btc focus:px-4 focus:py-2 focus:text-sm focus:text-black"
        >
          Saltar al contenido
        </button>
        <TopNav />
        <OfflineBanner />
        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-[1320px] px-4 pt-6 outline-none sm:px-6 sm:pt-8 lg:px-10 lg:pt-12">
          <motion.div key={pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }}>
            <Outlet />
          </motion.div>
        </main>
        <AppFooter />
        <BottomNav />
      </div>
    </MotionConfig>
  );
}