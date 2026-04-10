import { supabase } from "@/lib/supabase";
import type { Addon, AddonInsert, AddonUpdate } from "@/types/addon.types";
import { isAddonType } from "@/types/addon.types";

function saloonsIconColumn(): string | null {
  const c = import.meta.env.VITE_SALOONS_ICON_COLUMN?.trim();
  return c && c.length > 0 ? c : null;
}

function saloonsTypeColumn(): string | null {
  const c = import.meta.env.VITE_SALOONS_TYPE_COLUMN?.trim();
  return c && c.length > 0 ? c : null;
}

function saloonsOwnerColumn(): string {
  const c = import.meta.env.VITE_SALOONS_OWNER_COLUMN?.trim();
  return c && c.length > 0 ? c : "owner_id";
}

function saloonsSlugColumn(): string {
  const c = import.meta.env.VITE_SALOONS_SLUG_COLUMN?.trim();
  return c && c.length > 0 ? c : "slug";
}

function toSlug(input: string): string {
  return input
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
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

function normalizeAddon(row: Record<string, unknown>): Addon {
  const typeCol = saloonsTypeColumn();
  const rawType = String((typeCol ? row[typeCol] : undefined) ?? row.type ?? "general")
    .trim()
    .toLowerCase();
  const type = isAddonType(rawType) ? rawType : "general";
  const iconCol = saloonsIconColumn();
  const rawIcon = (iconCol ? row[iconCol] : undefined) ?? row.icon ?? row.icon_name;
  return {
    id: String(row.id ?? ""),
    type,
    name: String(row.name ?? ""),
    icon: rawIcon == null ? null : String(rawIcon),
    description: row.description == null ? null : String(row.description),
    address: row.address == null ? null : String(row.address),
    city: row.city == null ? null : String(row.city),
    phone: row.phone == null ? null : String(row.phone),
    email: row.email == null ? null : String(row.email),
    logo_url: row.logo_url == null ? null : String(row.logo_url),
    cover_url: row.cover_url == null ? null : String(row.cover_url),
    is_active: Boolean(row.is_active ?? false),
    settings:
      row.settings && typeof row.settings === "object" && !Array.isArray(row.settings)
        ? (row.settings as Record<string, unknown>)
        : {},
    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
  };
}

export async function fetchSaloons(): Promise<Addon[]> {
  const { data, error } = await supabase
    .from("salons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(formatSupabaseError(error));
  return (data ?? []).map((row) => normalizeAddon(row as Record<string, unknown>));
}

export async function fetchSaloonById(id: string): Promise<Addon | null> {
  const { data, error } = await supabase.from("salons").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(formatSupabaseError(error));
  if (!data) return null;
  return normalizeAddon(data as Record<string, unknown>);
}

export async function createSaloon(insert: AddonInsert): Promise<Addon> {
  const iconCol = saloonsIconColumn();
  const typeCol = saloonsTypeColumn();
  const ownerCol = saloonsOwnerColumn();
  const slugCol = saloonsSlugColumn();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError) throw new Error(formatSupabaseError(authError));
  if (!user) throw new Error("Oturum bulunamadı. Lütfen tekrar giriş yapın.");

  const payload: Record<string, unknown> = {
    name: insert.name,
    description: insert.description ?? null,
    address: insert.address ?? null,
    city: insert.city ?? null,
    phone: insert.phone ?? null,
    email: insert.email ?? null,
    logo_url: insert.logo_url ?? null,
    cover_url: insert.cover_url ?? null,
    is_active: insert.is_active,
    settings: insert.settings,
  };
  payload[ownerCol] = user.id;
  payload[slugCol] = toSlug(insert.name) || crypto.randomUUID().slice(0, 8);
  if (typeCol) {
    payload[typeCol] = insert.type;
  }
  if (iconCol) {
    payload[iconCol] = insert.icon ?? null;
  }

  const { data, error } = await supabase.from("salons").insert(payload).select().single();
  if (error) throw new Error(formatSupabaseError(error));
  return normalizeAddon(data as Record<string, unknown>);
}

export async function updateSaloon(id: string, patch: AddonUpdate): Promise<Addon> {
  const iconCol = saloonsIconColumn();
  const typeCol = saloonsTypeColumn();
  const slugCol = saloonsSlugColumn();
  const { icon, type, ...rest } = patch;
  const rowPatch: Record<string, unknown> = { ...rest };
  if (typeof patch.name === "string") {
    rowPatch[slugCol] = toSlug(patch.name) || crypto.randomUUID().slice(0, 8);
  }
  if (typeCol && type !== undefined) {
    rowPatch[typeCol] = type;
  }
  if (iconCol && icon !== undefined) {
    rowPatch[iconCol] = icon;
  }
  if (patch.settings !== undefined) {
    rowPatch.settings = patch.settings;
  }

  const { data, error } = await supabase
    .from("salons")
    .update(rowPatch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(formatSupabaseError(error));
  return normalizeAddon(data as Record<string, unknown>);
}

export async function deleteSaloon(id: string): Promise<void> {
  const { error } = await supabase.from("salons").delete().eq("id", id);
  if (error) throw new Error(formatSupabaseError(error));
}
