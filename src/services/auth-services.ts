import { supabase } from "@/lib/supabase";
import type { LoginRequest } from "@/types/auth.types";

export const login = async ({ email, password }: LoginRequest) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
