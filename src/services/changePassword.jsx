import supabase from './supabase/supabaseClient';


export const changePassword = async (email, currentPassword, newPassword) => {
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  });

  if (signInError) throw new Error("Current password is incorrect.");

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) throw updateError;

  return { success: true };
};
