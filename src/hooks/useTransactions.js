import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/services/storageService";

/**
 * CRUD de operaciones (punto 16). El almacenamiento en sí es síncrono
 * (localStorage), pero se expone vía React Query para que registrar,
 * editar o borrar una operación en un componente actualice
 * automáticamente a todos los demás (Dashboard, Transacciones, DCA...)
 * sin necesidad de un Context aparte.
 */
export function useTransactions() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["transactions"], queryFn: getTransactions, staleTime: Infinity });
  const transactions = query.data ?? [];

  const sync = () => queryClient.setQueryData(["transactions"], getTransactions());

  const add = (tx) => {
    const record = addTransaction(tx);
    sync();
    return record;
  };
  const update = (id, patch) => {
    const record = updateTransaction(id, patch);
    sync();
    return record;
  };
  const remove = (id) => {
    deleteTransaction(id);
    sync();
  };

  return { transactions, isLoading: query.isLoading, add, update, remove };
}
