import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useLoginState } from "@/hooks/use-login-state";
import {
  createSalonTeamMember,
  deleteSalonTeamMember,
  fetchSalonTeamMemberById,
  fetchSalonTeamMembers,
  updateSalonTeamMember,
} from "@/services/salon-team-service";
import type { SalonTeamInsert, SalonTeamUpdate } from "@/types/salon-team.types";

export const salonTeamQueryKey = ["salon-team"] as const;

export function salonTeamMemberQueryKey(id: string) {
  return ["salon-team", id] as const;
}

export function useSalonTeamQuery() {
  const { isLoggedIn, isActionable } = useLoginState();
  return useQuery({
    queryKey: salonTeamQueryKey,
    queryFn: fetchSalonTeamMembers,
    enabled: isLoggedIn && isActionable,
  });
}

export function useSalonTeamMemberQuery(id: string | null) {
  const { isLoggedIn, isActionable } = useLoginState();
  return useQuery({
    queryKey: id ? salonTeamMemberQueryKey(id) : ["salon-team", "none"],
    queryFn: () => fetchSalonTeamMemberById(id!),
    enabled: Boolean(id) && isLoggedIn && isActionable,
  });
}

export function useCreateSalonTeamMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SalonTeamInsert) => createSalonTeamMember(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: salonTeamQueryKey });
    },
  });
}

export function useUpdateSalonTeamMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: SalonTeamUpdate }) => updateSalonTeamMember(id, patch),
    onSuccess: (_data, { id }) => {
      void qc.invalidateQueries({ queryKey: salonTeamQueryKey });
      void qc.invalidateQueries({ queryKey: salonTeamMemberQueryKey(id) });
    },
  });
}

export function useDeleteSalonTeamMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSalonTeamMember(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: salonTeamQueryKey });
    },
  });
}
