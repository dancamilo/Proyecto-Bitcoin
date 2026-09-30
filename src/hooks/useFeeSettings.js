import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getFeeSettings, setFeeSettings, FEE_PLAN_PRESETS } from "@/services/storageService";

function resolvePlan(settings) {
  const preset = FEE_PLAN_PRESETS.find((p) => p.id === settings.activePlanId) ?? FEE_PLAN_PRESETS[0];
  if (preset.id !== "custom") return preset;
  return { ...preset, rate: settings.customRate, min: settings.customMin, mode: settings.customMode };
}

export function useFeeSettings() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["fee-settings"], queryFn: getFeeSettings, staleTime: Infinity });
  const settings = query.data ?? getFeeSettings();

  const update = (patch) => {
    const next = setFeeSettings(patch);
    queryClient.setQueryData(["fee-settings"], next);
    return next;
  };

  return { settings, activePlan: resolvePlan(settings), plans: FEE_PLAN_PRESETS, update };
}
