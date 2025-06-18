import supabase from './supabase/supabaseClient';

export async function getUserData() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Error getting user:", error);
    return null;
  }

  return data.user;
}
