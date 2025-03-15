'use server';

import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";

export async function signOut () {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }
    redirect("/sign-in");
};
