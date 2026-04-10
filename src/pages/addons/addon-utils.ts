export function parseAddonIdParam(idParam: string | undefined): string | null {
  const id = idParam?.trim();
  if (!id) return null;
  return id;
}

export function shortUuid(value: string): string {
  const s = value.trim();
  if (!s) return "—";
  return s.length <= 8 ? s : `${s.slice(0, 8)}…`;
}

export function formatAddonDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}
