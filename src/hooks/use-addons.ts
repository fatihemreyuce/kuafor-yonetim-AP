import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useLoginState } from "@/hooks/use-login-state";
import {
  createSaloon,
  deleteSaloon,
  fetchSaloonById,
  fetchSaloons,
  updateSaloon,
} from "@/services/addons-service";
import type { AddonInsert, AddonUpdate } from "@/types/addon.types";

export const saloonsQueryKey = ["saloons"] as const;

export function saloonQueryKey(id: string) {
  return ["saloon", id] as const;
}

export function useSaloonsQuery() {
  const { isLoggedIn, isActionable } = useLoginState();
  return useQuery({
    queryKey: saloonsQueryKey,
    queryFn: fetchSaloons,
    enabled: isLoggedIn && isActionable,
  });
}

export function useSaloonQuery(id: string | null) {
  const { isLoggedIn, isActionable } = useLoginState();
  return useQuery({
    queryKey: id ? saloonQueryKey(id) : ["saloon", "none"],
    queryFn: () => fetchSaloonById(id!),
    enabled: Boolean(id) && isLoggedIn && isActionable,
  });
}

export function useCreateSaloonMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddonInsert) => createSaloon(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: saloonsQueryKey });
    },
  });
}

export function useUpdateSaloonMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: AddonUpdate }) => updateSaloon(id, patch),
    onSuccess: (_data, { id }) => {
      void qc.invalidateQueries({ queryKey: saloonsQueryKey });
      void qc.invalidateQueries({ queryKey: saloonQueryKey(id) });
    },
  });
}

export function useDeleteSaloonMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSaloon(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: saloonsQueryKey });
    },
  });
}
