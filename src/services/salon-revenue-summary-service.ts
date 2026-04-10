import { supabase } from "@/lib/supabase";
import type {
  SalonRevenueSummary,
  SalonRevenueSummaryInsert,
  SalonRevenueSummaryUpdate,
} from "@/types/salon-revenue-summary.types";

/** Okuma: CRUD kayitlari entries tablosunda; view sadece aggregate ise burada gorunmez. */
function readTable(): string {
  const r = import.meta.env.VITE_REVENUE_READ_TABLE?.trim();
  if (r && r.length > 0) return r;
  return writeTable();
}

function writeTable(): string {
  const t = import.meta.env.VITE_REVENUE_WRITE_TABLE?.trim();
  return t && t.length > 0 ? t : "salon_revenue_summary_entries";
}

/** Supabase embed: salons FK varsa isim gelir. Yoksa sadece "*" kullan. */
function revenueSelectColumns(): string {
  const c = import.meta.env.VITE_REVENUE_SELECT?.trim();
  return c && c.length > 0 ? c : "*, salons(name)";
}

function revenueDescriptionColumn(): string | null {
  const c = import.meta.env.VITE_REVENUE_DESCRIPTION_COLUMN?.trim();
  return c && c.length > 0 ? c : null;
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

function pickSalonName(row: Record<string, unknown>): string | null {
  if (row.salon_name != null) return String(row.salon_name);
  const s = row.salons as unknown;
  if (s && typeof s === "object") {
    if (Array.isArray(s)) {
      const first = s[0] as { name?: unknown };
      if (first?.name != null) return String(first.name);
    } else {
      const o = s as { name?: unknown };
      if (o.name != null) return String(o.name);
    }
  }
  return null;
}

function normalizeRow(row: Record<string, unknown>): SalonRevenueSummary {
  const id =
    row.id == null
      ? `${String(row.salon_id ?? "none")}:${String(row.month ?? "none")}`
      : String(row.id);
  const descriptionCol = revenueDescriptionColumn();
  return {
    id,
    salon_id: row.salon_id == null ? null : String(row.salon_id),
    salon_name: pickSalonName(row),
    month: row.month == null ? null : String(row.month),
    payment_count:
      row.payment_count == null ? null : Number(row.payment_count),
    total_revenue:
      row.total_revenue == null ? null : Number(row.total_revenue),
    avg_payment: row.avg_payment == null ? null : Number(row.avg_payment),
    currency: row.currency == null ? null : String(row.currency),
    description:
      ((descriptionCol ? row[descriptionCol] : undefined) ?? row.description) == null
        ? null
        : String((descriptionCol ? row[descriptionCol] : undefined) ?? row.description),
  };
}

function splitSyntheticId(id: string): { salon_id: string; month: string } | null {
  const idx = id.indexOf(":");
  if (idx <= 0) return null;
  const salon_id = id.slice(0, idx).trim();
  const month = id.slice(idx + 1).trim();
  if (!salon_id || !month) return null;
  return { salon_id, month };
}

async function resolveCompositeFromWriteId(
  id: string,
): Promise<{ salon_id: string; month: string } | null> {
  const { data, error } = await supabase
    .from(writeTable())
    .select("salon_id, month")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(formatSupabaseError(error));
  if (!data) return null;
  const salon_id = data.salon_id == null ? "" : String(data.salon_id).trim();
  const month = data.month == null ? "" : String(data.month).trim();
  if (!salon_id || !month) return null;
  return { salon_id, month };
}

export async function fetchRevenueSummaries(): Promise<SalonRevenueSummary[]> {
  const { data, error } = await supabase
    .from(readTable())
    .select(revenueSelectColumns())
    .order("month", { ascending: false, nullsFirst: false });
  if (error) throw new Error(formatSupabaseError(error));
  return (data ?? []).map((r) => normalizeRow(r as unknown as Record<string, unknown>));
}

export async function fetchRevenueSummaryById(
  id: string,
): Promise<SalonRevenueSummary | null> {
  const composite = splitSyntheticId(id) ?? (await resolveCompositeFromWriteId(id));
  let q = supabase.from(readTable()).select(revenueSelectColumns());
  if (composite) {
    q = q.eq("salon_id", composite.salon_id).eq("month", composite.month);
  } else {
    q = q.eq("id", id);
  }
  const { data, error } = await q.maybeSingle();
  if (error) throw new Error(formatSupabaseError(error));
  if (!data) return null;
  return normalizeRow(data as unknown as Record<string, unknown>);
}

export async function createRevenueSummary(
  payload: SalonRevenueSummaryInsert,
): Promise<SalonRevenueSummary> {
  const descriptionCol = revenueDescriptionColumn();
  const { description, salon_name: _salonName, ...rest } = payload;
  const rowPayload: Record<string, unknown> = { ...rest };
  if (descriptionCol && description !== undefined) {
    rowPayload[descriptionCol] = description;
  }
  const { data, error } = await supabase
    .from(writeTable())
    .insert(rowPayload)
    .select("*")
    .single();
  if (error) throw new Error(formatSupabaseError(error));
  const created = normalizeRow(data as unknown as Record<string, unknown>);
  const enriched = await fetchRevenueSummaryById(created.id);
  return enriched ?? created;
}

export async function updateRevenueSummary(
  id: string,
  patch: SalonRevenueSummaryUpdate,
): Promise<SalonRevenueSummary> {
  const descriptionCol = revenueDescriptionColumn();
  const { description, salon_name: _salonName, ...rest } = patch;
  const rowPatch: Record<string, unknown> = { ...rest };
  if (descriptionCol && description !== undefined) {
    rowPatch[descriptionCol] = description;
  }
  const composite = splitSyntheticId(id);
  const query = supabase.from(writeTable()).update(rowPatch);
  const scoped = composite
    ? query.eq("salon_id", composite.salon_id).eq("month", composite.month)
    : query.eq("id", id);
  const { data, error } = await scoped.select().single();
  if (error) throw new Error(formatSupabaseError(error));
  const updated = normalizeRow(data as unknown as Record<string, unknown>);
  const enriched = await fetchRevenueSummaryById(updated.id);
  return enriched ?? updated;
}

export async function deleteRevenueSummary(id: string): Promise<void> {
  const composite = splitSyntheticId(id);
  const query = supabase.from(writeTable()).delete();
  const scoped = composite
    ? query.eq("salon_id", composite.salon_id).eq("month", composite.month)
    : query.eq("id", id);
  const { error } = await scoped;
  if (error) throw new Error(formatSupabaseError(error));
}
