import { EventCard } from "@/components/event-card";
import { createClient } from "@/supabase/server";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Users, Sparkles, Heart, ChevronDown } from "lucide-react";
import Link from "next/link";
import { HostInfo } from "@/components/host-info";
import { Card, CardContent } from "@/components/ui/card";

const features = [
    {
      icon: <Calendar className="w-8 h-8 text-blue-500" />,
      title: "Regular Events",
      description: "From game nights to holiday celebrations, there's always something exciting happening in our community."
    },
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: "Community Building",
      description: "Create lasting friendships and meaningful connections with your neighbors."
    },
    {
      icon: <Sparkles className="w-8 h-8 text-blue-500" />,
      title: "Diverse Activities",
      description: "Enjoy a variety of events from social gatherings to educational workshops."
    },
    {
      icon: <Heart className="w-8 h-8 text-blue-500" />,
      title: "Inclusive Environment",
      description: "Everyone is welcome to participate and contribute to our community spirit."
    }
  ];

async function getEvents() {
  const supabase = await createClient();
  const now = new Date().toISOString();

  // Get upcoming events
  const { data: upcomingEvents, error: upcomingError } = await supabase
    .from("events")
    .select(`
      *,
      attendees(count)
    `)
    .gte("event_date", now)
    .order("event_date", { ascending: true })
    .limit(4);

  // Get past events
  const { data: pastEvents, error: pastError } = await supabase
    .from("events")
    .select(`
      *,
      attendees(count)
    `)
    .lt("event_date", now)
    .order("event_date", { ascending: false })
    .limit(4);

  if (upcomingError || pastError) {
    console.error("Error fetching events:", upcomingError || pastError);
    return { upcomingEvents: [], pastEvents: [], hasMoreUpcoming: false, hasMorePast: false };
  }

  // Check if there are more events
  const { count: upcomingCount } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })
    .gte("event_date", now);

  const { count: pastCount } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })
    .lt("event_date", now);

  return {
    upcomingEvents: upcomingEvents || [],
    pastEvents: pastEvents || [],
    hasMoreUpcoming: (upcomingCount || 0) > 3,
    hasMorePast: (pastCount || 0) > 3
  };
}


export default async function Home() {
  const { upcomingEvents, pastEvents, hasMoreUpcoming, hasMorePast } = await getEvents();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="relative h-[600px] max-w-7xl mx-auto rounded-3xl overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1611106014123-092d7642f560?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Community gathering"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 via-blue-900/50 to-blue-900/80" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white max-w-3xl mx-auto">
            Building a Vibrant Community Together
          </h1>
          <p className="mt-6 text-xl text-white/90 max-w-2xl mx-auto">
            More than just neighbors – we're a community that celebrates life's moments together, creating lasting connections and memorable experiences.
          </p>
          <a 
            href="#upcoming-events" 
            className="mt-12 animate-bounce"
          >
            <Button 
              size="icon" 
              variant="outline"
              className="rounded-full w-12 h-12 bg-white/10 border-white/20 hover:bg-white/20 transition-colors"
            >
              <ChevronDown className="h-6 w-6 text-white" />
            </Button>
          </a>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white hover:shadow-lg transition-shadow rounded-3xl">
              <CardContent className="p-6 space-y-4">
                <div className="p-3 bg-blue-50 rounded-3xl w-fit">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-blue-900">
                  {feature.title}
                </h3>
                <p className="text-blue-700">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Upcoming Events Section */}
      <section id="upcoming-events" className="space-y-8 px-4 scroll-mt-16 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Upcoming Events</h1>
          {hasMoreUpcoming && (
            <Button asChild variant="ghost" className="group">
              <Link href="/events" className="flex items-center">
                See all events
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          )}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
          {upcomingEvents.length === 0 && (
            <p className="text-muted-foreground col-span-full text-center py-8">
              No upcoming events at this time.
            </p>
          )}
        </div>
      </section>

    
      {/* {pastEvents.length > 0 && (
        <section className="space-y-8 px-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">Past Events</h2>
            {hasMorePast && (
              <Button asChild variant="ghost" className="group">
                <Link href="/events/past" className="flex items-center">
                  See all past events
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            )}
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )} */}

      {/* Mission Statement */}
      <div className="max-w-7xl mx-auto px-4 border-none">
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100 border-none rounded-3xl shadow-none">
          <CardContent className="p-8 text-center space-y-6">
            <h2 className="text-3xl font-bold text-blue-900">Our Mission</h2>
            <p className="text-lg text-blue-700 max-w-3xl mx-auto leading-relaxed">
              We're dedicated to transforming our apartment complex into a thriving community where every resident feels connected and valued. Through thoughtfully planned events and activities, we create spaces for meaningful interactions and shared experiences.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Host Info Section */}
      <section className="pt-8 px-4">
        <HostInfo />
      </section>
    </div>
  );
}