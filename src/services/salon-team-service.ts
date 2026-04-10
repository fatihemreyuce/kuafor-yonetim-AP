import { supabase } from "@/lib/supabase";
import type { SalonTeamInsert, SalonTeamMember, SalonTeamUpdate } from "@/types/salon-team.types";

function tableName(): string {
  const t = import.meta.env.VITE_SALON_TEAM_TABLE?.trim();
  return t && t.length > 0 ? t : "salon_team";
}

function formatSupabaseError(err: { message: string; hint?: string | null; details?: string | null; code?: string }): string {
  const parts = [err.message];
  if (err.details) parts.push(String(err.details));
  if (err.hint) parts.push(String(err.hint));
  if (err.code) parts.push(`[${err.code}]`);
  return parts.join(" — ");
}

function normalizeMember(row: Record<string, unknown>): SalonTeamMember {
  return {
    id: String(row.id ?? ""),
    profile_id: row.profile_id == null ? null : String(row.profile_id),
    salon_id: row.salon_id == null ? null : String(row.salon_id),
    display_name: row.display_name == null ? null : String(row.display_name),
    title: row.title == null ? null : String(row.title),
    avatar_url: row.avatar_url == null ? null : String(row.avatar_url),
    color_key: row.color_key == null ? null : String(row.color_key),
    is_active: Boolean(row.is_active ?? false),
    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
  };
}

export async function fetchSalonTeamMembers(): Promise<SalonTeamMember[]> {
  const { data, error } = await supabase.from(tableName()).select("*").order("created_at", { ascending: false });
  if (error) throw new Error(formatSupabaseError(error));
  return (data ?? []).map((row) => normalizeMember(row as Record<string, unknown>));
}

export async function fetchSalonTeamMemberById(id: string): Promise<SalonTeamMember | null> {
  const { data, error } = await supabase.from(tableName()).select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(formatSupabaseError(error));
  if (!data) return null;
  return normalizeMember(data as Record<string, unknown>);
}

export async function createSalonTeamMember(payload: SalonTeamInsert): Promise<SalonTeamMember> {
  const { data, error } = await supabase.from(tableName()).insert(payload).select().single();
  if (error) throw new Error(formatSupabaseError(error));
  return normalizeMember(data as Record<string, unknown>);
}

export async function updateSalonTeamMember(id: string, patch: SalonTeamUpdate): Promise<SalonTeamMember> {
  const { data, error } = await supabase.from(tableName()).update(patch).eq("id", id).select().single();
  if (error) throw new Error(formatSupabaseError(error));
  return normalizeMember(data as Record<string, unknown>);
}

export async function deleteSalonTeamMember(id: string): Promise<void> {
  const { error } = await supabase.from(tableName()).delete().eq("id", id);
  if (error) throw new Error(formatSupabaseError(error));
}
