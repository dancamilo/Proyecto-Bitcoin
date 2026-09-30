import { Link, useLocation } from "react-router-dom";

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md text-center">
        <p className="text-7xl font-light text-muted-foreground/40">404</p>
        <div className="mx-auto mt-3 h-0.5 w-16 bg-white/10" />
        <h1 className="mt-6 text-2xl font-medium text-foreground">Página no encontrada</h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          La ruta <span className="font-medium text-foreground/85">"{pageName}"</span> no existe en esta aplicación.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center rounded-full bg-btc px-5 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
