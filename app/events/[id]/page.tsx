// EventPage (Server Component)

import { notFound } from "next/navigation";
import { format } from "date-fns";
import { createClient } from "@/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users } from "lucide-react";
import { getUser } from "@/queries/user";
import { SignupButton } from "@/components/signup-button";
import { HostInfo } from "@/components/host-info";
import { Button } from "@/components/ui/button";
import { ClientSideSignInButton } from "@/components/client-side-signin-button"; // Import the Client-Side Sign In Button

// Define the type for signup objects
interface Signup {
  id: string;
  canceled: boolean;
  user_id: string;
}

// Interface for the page props
interface PageProps {
  params: Promise<{ id: string }>;
}

async function getEvent(id: string) {
  const supabase = await createClient();
  const user = await getUser();  // This fetches the logged-in user

  // Start the query for the event
  const query = supabase
    .from("events")
    .select(`
      *,
      signups: signups(count),
      user_signup: signups(
        id,
        canceled,
        user_id
      )
    `)
    .eq("id", id);

  // Only add user signup condition if user is logged in
  if (user) {
    query.eq("user_signup.user_id", user.id); // Get the signup status of the logged-in user
  }

  const { data: event, error } = await query.single();

  if (error || !event) {
    return null;
  }

  return { event, user };
}

export default async function EventPage({ params }: PageProps) {
 // First await the params Promise
 const resolvedParams = await params;
 const { id } = resolvedParams;

  if (!id) {
    notFound();
  }

  const result = await getEvent(id);
  
  if (!result) {
    notFound();
  }
  
  const { event, user } = result;

  const isDeadlinePassed = new Date(event.signup_deadline) < new Date();
  const isPastEvent = new Date(event.event_date) < new Date();
  const signupCount = event.signups[0]?.count || 0;
  const isFull = event.max_signups ? signupCount >= event.max_signups : false;

  // Check if the user is logged in and has signed up for the event
  let userSignup = null;
  if (user) {
    userSignup = event.user_signup.find((signup: Signup) => signup.user_id === user.id) || null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">{event.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center text-lg">
            <Calendar className="mr-2 h-6 w-6" />
            {format(new Date(event.event_date), "PPP 'at' p")}
          </div>
          {event.max_signups && (
            <div className="flex items-center text-lg">
              <Users className="mr-2 h-6 w-6" />
              {signupCount} / {event.max_signups} spots filled
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="aspect-square relative overflow-hidden rounded-lg">
          <img
            src={event.image_urls[0]}
            alt={event.title}
            className="object-cover w-full h-full rounded-3xl"
          />
        </div>

        <div className="space-y-6">
          <Card className="rounded-3xl">
            <CardContent className="pt-6 space-y-6">
              {isPastEvent ? (
                <Button disabled className="w-full h-16 text-lg text-white rounded-3xl">
                  Event has ended
                </Button>
              ) : user ? (
                userSignup ? (
                  // If user is signed up, show the cancel registration button
                  <SignupButton
                    eventId={event.id}
                    isDeadlinePassed={isDeadlinePassed}
                    isFull={isFull}
                    userSignup={userSignup}
                    user={user}
                  />
                ) : (
                  // If user is logged in but not signed up for the event, show the regular sign up button
                  <SignupButton
                    eventId={event.id}
                    isDeadlinePassed={isDeadlinePassed}
                    isFull={isFull}
                    userSignup={null} // No existing signup
                    user={user}
                  />
                )
              ) : (
                // If no user is logged in, show the sign-in button
                <ClientSideSignInButton currentRoute={`/events/${id}`} />
              )}

              <div className="prose dark:prose-invert">
                <p className="whitespace-pre-wrap">{event.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-12">
        <HostInfo />
      </div>
    </div>
  );
}