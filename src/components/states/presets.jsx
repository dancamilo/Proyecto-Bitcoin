import { Calculator, CircleCheck, CircleDashed, Inbox, Loader2, RefreshCw, RotateCw, TriangleAlert, WifiOff } from "lucide-react";
import StateBlock from "@/components/states/StateBlock";
import ActionButton from "@/components/ui-kit/ActionButton";

export const LoadingState = ({ title = "Esperando datos del mercado…", description, compact }) => (
  <StateBlock icon={Loader2} iconClassName="animate-spin" tone="btc" title={title} description={description} compact={compact} />
);

export const EmptyState = ({ title = "Sin operaciones registradas.", description = "Cuando registres una operación aparecerá aquí.", action, compact, icon = Inbox }) => (
  <StateBlock icon={icon} title={title} description={description} action={action} compact={compact} />
);

export const ErrorState = ({ title = "No se pudieron cargar los datos", description = "Comprueba tu conexión e inténtalo de nuevo.", onRetry, compact }) => (
  <StateBlock
    icon={TriangleAlert}
    tone="error"
    role="alert"
    title={title}
    description={description}
    compact={compact}
    action={onRetry && <ActionButton variant="secondary" size="sm" icon={RotateCw} onClick={onRetry}>Reintentar</ActionButton>}
  />
);

export const OfflineState = ({ compact }) => (
  <StateBlock icon={WifiOff} tone="warn" title="Sin conexión" description="Mostrando los últimos datos disponibles." compact={compact} />
);

export const NoDataState = ({ compact, title = "Sin datos para este periodo" }) => (
  <StateBlock icon={CircleDashed} title={title} description="Prueba con otro rango de fechas." compact={compact} />
);

export const SuccessState = ({ compact, title = "Operación registrada", description = "Los datos se han actualizado." }) => (
  <StateBlock icon={CircleCheck} tone="gain" title={title} description={description} compact={compact} />
);

export const CalculatingState = ({ compact }) => (
  <StateBlock icon={Calculator} iconClassName="animate-pulse" tone="btc" title="Calculando estimación…" description="Aplicando precio y comisión." compact={compact} />
);

export const UpdatingState = ({ compact, time = "15:52" }) => (
  <StateBlock icon={RefreshCw} iconClassName="animate-spin" tone="info" title="Actualizando precios…" description={`Última actualización ${time}`} compact={compact} />
);