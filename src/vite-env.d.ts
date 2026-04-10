/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  /** Public storage bucket for avatars (optional; otherwise JPEG data URL is used). */
  readonly VITE_SUPABASE_AVATAR_BUCKET?: string;
  /** `profiles` tablosundaki rol sütunu adı (`role` veya `user_role`). */
  readonly VITE_PROFILES_ROLE_COLUMN?: string;
  /** Postgres `user_role` enum etiketi — uygulama rolü başına isteğe bağlı override. */
  readonly VITE_DB_USER_ROLE_OWNER?: string;
  readonly VITE_DB_USER_ROLE_ADMIN?: string;
  readonly VITE_DB_USER_ROLE_STAFF?: string;
  readonly VITE_DB_USER_ROLE_CUSTOMER?: string;
  readonly VITE_DB_USER_ROLE_USER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
