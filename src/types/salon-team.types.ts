export interface SalonTeamMember {
  id: string;
  profile_id: string | null;
  salon_id: string | null;
  display_name: string | null;
  title: string | null;
  avatar_url: string | null;
  color_key: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type SalonTeamInsert = {
  profile_id?: string | null;
  salon_id?: string | null;
  display_name?: string | null;
  title?: string | null;
  avatar_url?: string | null;
  color_key?: string | null;
  is_active: boolean;
};

export type SalonTeamUpdate = {
  profile_id?: string | null;
  salon_id?: string | null;
  display_name?: string | null;
  title?: string | null;
  avatar_url?: string | null;
  color_key?: string | null;
  is_active?: boolean;
};
