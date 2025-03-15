import { createClient } from "@/supabase/server";
import { getUser } from "@/queries/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const eventId = formData.get("eventId") as string;
    const user = await getUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const supabase = await createClient();

    const { error } = await supabase.from("signups").insert({
      event_id: eventId,
      user_id: user.id,
    });

    if (error) {
      return new NextResponse(error.message, { status: 400 });
    }

    return NextResponse.redirect(new URL(`/events/${eventId}`, request.url));
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}