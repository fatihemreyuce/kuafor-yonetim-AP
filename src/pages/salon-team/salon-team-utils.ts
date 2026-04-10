export function parseSalonTeamIdParam(id: string | undefined): string | null {
  const t = id?.trim();
  return t ? t : null;
}

export function shortId(value: string): string {
  const t = value.trim();
  if (!t) return "—";
  return t.length > 10 ? `${t.slice(0, 10)}…` : t;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(d);
}
