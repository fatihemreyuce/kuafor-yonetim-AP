export function parseRevenueSummaryIdParam(idParam: string | undefined): string | null {
  const id = idParam?.trim();
  if (!id) return null;
  return id;
}

export function shortId(value: string): string {
  const v = value.trim();
  if (!v) return "—";
  return v.length > 10 ? `${v.slice(0, 10)}…` : v;
}

export function formatMonth(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }).format(d);
}

export function formatMoney(value: number | null, currency: string | null): string {
  if (value == null) return "—";
  const c = currency?.trim() || "TRY";
  try {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: c }).format(value);
  } catch {
    return `${value.toFixed(2)} ${c}`;
  }
}
