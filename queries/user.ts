"use server";

import { createClient } from "@/supabase/server";

export const getUser = async () => {
  const supabase = await createClient();
  
  // Get auth user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return null;
  }

  // Get user profile with role
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Error fetching user profile:", profileError);
  }

  // Return combined user data
  return {
    ...user,
    role: profile?.role || 'tenant'
  };
};