"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar, Edit2, Clock, ArrowRight, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfileHeader } from "@/components/profile-header";
import { CreateEventButton } from "@/components/create-event-button";
import { createClient } from "@/supabase/client";
import Link from "next/link";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  apartment_number: string;
  profile_picture?: string;
  role: 'tenant' | 'editor' | 'admin';
}

type Event = {
  id: string;
  title: string;
  description: string;
  event_date: string;
  signup_deadline: string;
  image_urls: string[];
  attendees_count: number;
  signed_up: boolean;
};

type SignUp = {
  id: any;
  event: Event;
};

export default function ProfileClient({ userId, userEmail }: { userId: string; userEmail: string }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      try {
        // Get user profile
        const { data: profileData, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        if (profileError) {
          setProfile(null);
        } else {
          setProfile(profileData);
        }

        // Call the Supabase function to get events with the user's signup status
        const { data, error } = await supabase
          .rpc('get_upcoming_events_with_signups', { user_id: userId })
          .select('*');  // Explicit select

        if (error) throw error;

        // Convert timestamp to ISO strings
        const processedEvents = data?.map(event => ({
          ...event,
          event_date: new Date(event.event_date).toISOString(),
          signup_deadline: new Date(event.signup_deadline).toISOString()
        })) || [];

        setEvents(processedEvents);

      } catch (error: any) {
        console.error("Error loading profile data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [userId, userEmail]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading profile: {error}</p>
      </div>
    );
  }

  const now = new Date();
  const upcomingEvents = events.filter(event => new Date(event.event_date) >= now);
  const pastEvents = events.filter(event => new Date(event.event_date) < now);

  return (
    <div className="space-y-8">
      {profile && <ProfileHeader profile={profile} />}

      <div className="space-y-8">
        {/* Upcoming Events Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Upcoming Events</h2>
            {profile?.role === 'admin' && (
              <CreateEventButton 
                editingEvent={editingEvent} 
                onClose={() => setEditingEvent(null)} 
              />
            )}
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                isAdmin={profile?.role === 'admin'}
                onEdit={setEditingEvent}
              />
            ))}
            {upcomingEvents.length === 0 && (
              <p className="text-muted-foreground col-span-full text-center py-8">
                No upcoming events.
              </p>
            )}
          </div>
        </div>

        {/* Past Events Section */}
        {pastEvents.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Past Events</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pastEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event}
                  isAdmin={profile?.role === 'admin'}
                  onEdit={setEditingEvent}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EventCard({ 
  event, 
  isAdmin, 
  onEdit 
}: { 
  event: Event; 
  isAdmin: boolean;
  onEdit: (event: Event) => void;
}) {
  const truncatedDescription = event.description.length > 120 
    ? `${event.description.substring(0, 120)}...` 
    : event.description;

  //const attendeeCount = event.attendees?.[0]?.count || 0;
  const showAttendees = event.attendees_count > 5;


  return (
    <Card className="overflow-hidden max-w-sm mx-auto rounded-3xl">
      <div className="aspect-square relative">
        <img
          src={event.image_urls[0]}
          alt={event.title}
          className="object-cover w-full h-full"
        />
        {isAdmin && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2 text-white rounded-3xl bg-black/50 hover:bg-black/70"
            onClick={() => onEdit(event)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <div className="flex flex-col space-y-1">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            {format(new Date(event.event_date), "PPP")}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            {format(new Date(event.event_date), "p")}
          </div>
          {showAttendees && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="mr-2 h-4 w-4" />
            {event.attendees_count} {event.attendees_count === 1 ? 'attendee' : 'attendees'}
          </div>
        )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{truncatedDescription}</p>
      </CardContent>
      <CardFooter>
        <Button 
          asChild 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white group rounded-3xl"
        >
          <Link href={`/events/${event.id}`} className="flex items-center justify-center">
            View Details
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
