import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPreferences, setPreferences } from "@/services/storageService";

export function usePreferences() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["preferences"], queryFn: getPreferences, staleTime: Infinity });

  const update = (patch) => {
    const next = setPreferences(patch);
    queryClient.setQueryData(["preferences"], next);
    return next;
  };

  return { preferences: query.data ?? getPreferences(), setPreferences: update };
}
