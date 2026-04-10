import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useLoginState } from "@/hooks/use-login-state";
import {
  createProfile,
  deleteProfile,
  fetchProfileById,
  fetchProfiles,
  updateProfile,
} from "@/services/profiles-service";
import type { ProfileInsert, ProfileUpdate } from "@/types/profile.types";

export const profilesQueryKey = ["profiles"] as const;

export function profileQueryKey(id: string) {
  return ["profile", id] as const;
}

export function useProfilesQuery() {
  const { isLoggedIn, isActionable } = useLoginState();
  return useQuery({
    queryKey: profilesQueryKey,
    queryFn: fetchProfiles,
    enabled: isActionable && isLoggedIn,
  });
}

export function useProfileQuery(id: string | null) {
  const { isLoggedIn, isActionable } = useLoginState();
  return useQuery({
    queryKey: id ? profileQueryKey(id) : ["profile", "none"],
    queryFn: () => fetchProfileById(id!),
    enabled: Boolean(id) && isActionable && isLoggedIn,
  });
}

export function useCreateProfileMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProfileInsert) => createProfile(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: profilesQueryKey });
    },
  });
}

export function useUpdateProfileMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: ProfileUpdate }) =>
      updateProfile(id, patch),
    onSuccess: (_data, { id }) => {
      void qc.invalidateQueries({ queryKey: profilesQueryKey });
      void qc.invalidateQueries({ queryKey: profileQueryKey(id) });
    },
  });
}

export function useDeleteProfileMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProfile(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: profilesQueryKey });
    },
  });
}
