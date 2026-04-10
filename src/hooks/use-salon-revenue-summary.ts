import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useLoginState } from "@/hooks/use-login-state";
import {
  createRevenueSummary,
  deleteRevenueSummary,
  fetchRevenueSummaries,
  fetchRevenueSummaryById,
  updateRevenueSummary,
} from "@/services/salon-revenue-summary-service";
import type {
  SalonRevenueSummaryInsert,
  SalonRevenueSummaryUpdate,
} from "@/types/salon-revenue-summary.types";

export const revenueSummariesQueryKey = ["salon-revenue-summary"] as const;

export function revenueSummaryQueryKey(id: string) {
  return ["salon-revenue-summary", id] as const;
}

export function useRevenueSummariesQuery() {
  const { isLoggedIn, isActionable } = useLoginState();
  return useQuery({
    queryKey: revenueSummariesQueryKey,
    queryFn: fetchRevenueSummaries,
    enabled: isLoggedIn && isActionable,
  });
}

export function useRevenueSummaryQuery(id: string | null) {
  const { isLoggedIn, isActionable } = useLoginState();
  return useQuery({
    queryKey: id ? revenueSummaryQueryKey(id) : ["salon-revenue-summary", "none"],
    queryFn: () => fetchRevenueSummaryById(id!),
    enabled: Boolean(id) && isLoggedIn && isActionable,
  });
}

export function useCreateRevenueSummaryMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SalonRevenueSummaryInsert) => createRevenueSummary(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: revenueSummariesQueryKey });
    },
  });
}

export function useUpdateRevenueSummaryMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: SalonRevenueSummaryUpdate }) =>
      updateRevenueSummary(id, patch),
    onSuccess: (_data, { id }) => {
      void qc.invalidateQueries({ queryKey: revenueSummariesQueryKey });
      void qc.invalidateQueries({ queryKey: revenueSummaryQueryKey(id) });
    },
  });
}

export function useDeleteRevenueSummaryMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRevenueSummary(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: revenueSummariesQueryKey });
    },
  });
}
