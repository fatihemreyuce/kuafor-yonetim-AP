import { supabase } from "@/lib/supabase";
import type { Profile, ProfileInsert, ProfileUpdate } from "@/types/profile.types";
import { roleFromDatabase, roleToDatabase } from "@/types/profile.types";

function parseProfileId(value: unknown): string {
  if (value == null) return "";
  const s = String(value).trim();
  return s;
}

/** Tablodaki rol sütunu adı: çoğu şemada `role`, bazılarında `user_role`. */
function profilesRoleColumn(): string {
  const c = import.meta.env.VITE_PROFILES_ROLE_COLUMN?.trim();
  return c && c.length > 0 ? c : "role";
}

function formatSupabaseError(err: {
  message: string;
  hint?: string | null;
  details?: string | null;
  code?: string;
}): string {
  const parts = [err.message];
  if (err.details) parts.push(String(err.details));
  if (err.hint) parts.push(String(err.hint));
  if (err.code) parts.push(`[${err.code}]`);
  return parts.join(" — ");
}

function normalizeProfile(row: Record<string, unknown>): Profile {
  const roleCol = profilesRoleColumn();
  const rawRole = row[roleCol] ?? row.role ?? row.user_role;
  const role =
    typeof rawRole === "string" ? roleFromDatabase(rawRole) : "user";
  const id = parseProfileId(row.id);
  const rawUserId = row.user_id;
  const user_id =
    rawUserId == null || rawUserId === ""
      ? null
      : String(rawUserId);
  return {
    id,
    user_id,
    role,
    full_name: String(row.full_name ?? ""),
    phone: row.phone == null ? null : String(row.phone),
    avatar_url: row.avatar_url == null ? null : String(row.avatar_url),
    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
  };
}

export async function fetchProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(formatSupabaseError(error));
  return (data ?? []).map((row) =>
    normalizeProfile(row as Record<string, unknown>),
  );
}

export async function fetchProfileById(id: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(formatSupabaseError(error));
  if (!data) return null;
  return normalizeProfile(data as Record<string, unknown>);
}

export async function createProfile(insert: ProfileInsert): Promise<Profile> {
  const roleCol = profilesRoleColumn();
  const payload: Record<string, unknown> = {
    full_name: insert.full_name,
    phone: insert.phone ?? null,
    avatar_url: insert.avatar_url ?? null,
  };
  const explicitId = insert.id?.trim();
  if (explicitId) payload.id = explicitId;
  payload[roleCol] = roleToDatabase(insert.role);

  const { data, error } = await supabase
    .from("profiles")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(formatSupabaseError(error));
  return normalizeProfile(data as Record<string, unknown>);
}

export async function updateProfile(
  id: string,
  patch: ProfileUpdate,
): Promise<Profile> {
  const roleCol = profilesRoleColumn();
  const { role: rolePatch, ...rest } = patch;
  const rowPatch: Record<string, unknown> = { ...rest };
  if (rolePatch !== undefined) {
    rowPatch[roleCol] = roleToDatabase(rolePatch);
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(rowPatch)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(formatSupabaseError(error));
  return normalizeProfile(data as Record<string, unknown>);
}

export async function deleteProfile(id: string): Promise<void> {
  const { error } = await supabase.from("profiles").delete().eq("id", id);
  if (error) throw new Error(formatSupabaseError(error));
}
