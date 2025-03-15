import { createClient } from "@/supabase/server";
import { getUser } from "@/queries/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const signupId = formData.get("signupId") as string;
    const user = await getUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("signups")
      .update({ canceled: true })
      .eq("id", signupId)
      .eq("user_id", user.id);

    if (error) {
      return new NextResponse(error.message, { status: 400 });
    }

    // Get the event ID to redirect back to the event page
    const { data: signup } = await supabase
      .from("signups")
      .select("event_id")
      .eq("id", signupId)
      .single();
    
      if (!signup) {
        return new NextResponse("Signup not found", { status: 404 });
      }

    return NextResponse.redirect(new URL(`/events/${signup.event_id}`, request.url));
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}