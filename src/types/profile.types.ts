/**
 * Form ve TypeScript tarafındaki rol anahtarları.
 * `public.user_role` enum ile aynı sıra/etiketler (Supabase’deki son hâl).
 *
 * Yeni profil: `id` gönderilmezse servis `crypto.randomUUID()` üretir (veya DB DEFAULT).
 * `profiles.id` ↔ `auth.users.id` FK kullanıyorsan önce auth’ta kullanıcı oluşturup id’yi eşleştirmen gerekir.
 */
export const USER_ROLES = [
  "owner",
  "admin",
  "staff",
  "customer",
  "user",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

/**
 * Postgres enum etiketi (çoğunlukla anahtar ile aynı). `.env` ile rol başına ezilebilir.
 */
export const USER_ROLE_DB_LABEL: Record<UserRole, string> = {
  owner: "owner",
  admin: "admin",
  staff: "staff",
  customer: "customer",
  user: "user",
};

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  owner: "Sahip",
  admin: "Yönetici",
  staff: "Personel",
  customer: "Müşteri",
  user: "Kullanıcı",
};

function effectiveDbLabel(appRole: UserRole): string {
  const fromEnv: Record<UserRole, string | undefined> = {
    owner: import.meta.env.VITE_DB_USER_ROLE_OWNER,
    admin: import.meta.env.VITE_DB_USER_ROLE_ADMIN,
    staff: import.meta.env.VITE_DB_USER_ROLE_STAFF,
    customer: import.meta.env.VITE_DB_USER_ROLE_CUSTOMER,
    user: import.meta.env.VITE_DB_USER_ROLE_USER,
  };
  const raw = fromEnv[appRole];
  if (typeof raw === "string" && raw.trim() !== "") {
    return raw.trim();
  }
  return USER_ROLE_DB_LABEL[appRole];
}

/** INSERT/UPDATE gövdesine giden enum değeri */
export function roleToDatabase(role: UserRole): string {
  return effectiveDbLabel(role);
}

/** SELECT sonucu satırdaki enum → uygulama rolü */
export function roleFromDatabase(raw: string): UserRole {
  const v = raw.trim();
  for (const r of USER_ROLES) {
    if (effectiveDbLabel(r) === v) return r;
  }
  return isUserRole(v) ? v : "user";
}

export interface Profile {
  id: string;
  user_id: string | null;
  role: UserRole;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

/** `id` yoksa otomatik uuid atanır */
export type ProfileInsert = {
  id?: string;
  role: UserRole;
  full_name: string;
  phone?: string | null;
  avatar_url?: string | null;
};

export type ProfileUpdate = {
  full_name?: string;
  role?: UserRole;
  phone?: string | null;
  avatar_url?: string | null;
};

export function isUserRole(value: string): value is UserRole {
  return (USER_ROLES as readonly string[]).includes(value);
}
