import { createClient } from "@/supabase/server";
import { EventCard } from "@/components/event-card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import { EventsNavigation } from "@/components/events-navigation";

interface Event {
  id: string;
  title: string;
  description: string;
  image_urls: string[];
  event_date: string;
  signup_deadline: string;
  max_signups?: number;
  attendees: { count: number }[];
}

interface EventsData {
  upcoming: Event[];
  past: Event[];
}

async function getAllEvents(): Promise<EventsData> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  // Get all events
  const { data: events, error } = await supabase
    .from("events")
    .select(`
      *,
      attendees(count)
    `)
    .order("event_date", { ascending: true });

  if (error) {
    console.error("Error fetching events:", error);
    return { upcoming: [], past: [] };
  }

  // Split events into upcoming and past
  const upcoming = (events || []).filter(event => new Date(event.event_date) >= new Date());
  const past = (events || []).filter(event => new Date(event.event_date) < new Date());

  // Sort past events in reverse chronological order
  past.sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());

  return { upcoming, past };
}

export default async function EventsPage() {
  const { upcoming, past } = await getAllEvents();

  return (
    <div className="space-y-16 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">All Events</h1>
        <EventsNavigation />
      </div>

      {/* Upcoming Events Section */}
      <section id="upcoming" className="space-y-8 scroll-mt-16">
        <h2 className="text-3xl font-bold">Upcoming Events</h2>
        {upcoming.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-3xl">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No Upcoming Events</h3>
            <p className="mt-2 text-gray-500">Check back soon for new events!</p>
          </div>
        )}
      </section>

      {/* Past Events Section */}
      <section id="past" className="space-y-8 scroll-mt-16">
        <h2 className="text-3xl font-bold">Past Events</h2>
        {past.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {past.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-3xl">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No Past Events</h3>
            <p className="mt-2 text-gray-500">Stay tuned for our first event!</p>
          </div>
        )}
      </section>
    </div>
  );
}