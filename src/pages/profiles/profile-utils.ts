/** URL’deki profil parametresi — uuid (auth.users.id ile aynı) */
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function parseProfileIdParam(id: string | undefined): string | null {
  if (id === undefined || id === "") return null;
  const t = id.trim();
  return UUID_RE.test(t) ? t.toLowerCase() : null;
}

export function formatProfileDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("tr-TR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function shortUuid(uuid: string, keep = 8) {
  if (uuid.length <= keep + 1) return uuid;
  return `${uuid.slice(0, keep)}…`;
}
