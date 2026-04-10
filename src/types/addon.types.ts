export const ADDON_TYPES = [
  "editing",
  "effect",
  "advanced",
  "social",
  "general",
] as const;

export type AddonType = (typeof ADDON_TYPES)[number];

export const ADDON_TYPE_LABELS: Record<AddonType, string> = {
  editing: "Editing",
  effect: "Effect",
  advanced: "Advanced",
  social: "Social",
  general: "General",
};

export interface Addon {
  id: string;
  type: AddonType;
  name: string;
  icon: string | null;
  description: string | null;
  address: string | null;
  city: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  cover_url: string | null;
  is_active: boolean;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export type AddonInsert = {
  type: AddonType;
  name: string;
  icon?: string | null;
  description?: string | null;
  address?: string | null;
  city?: string | null;
  phone?: string | null;
  email?: string | null;
  logo_url?: string | null;
  cover_url?: string | null;
  is_active: boolean;
  settings: Record<string, unknown>;
};

export type AddonUpdate = {
  type?: AddonType;
  name?: string;
  icon?: string | null;
  description?: string | null;
  address?: string | null;
  city?: string | null;
  phone?: string | null;
  email?: string | null;
  logo_url?: string | null;
  cover_url?: string | null;
  is_active?: boolean;
  settings?: Record<string, unknown>;
};

export function isAddonType(value: string): value is AddonType {
  return (ADDON_TYPES as readonly string[]).includes(value);
}
