"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, ArrowRight, Clock } from "lucide-react";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    image_urls: string[];
    event_date: string;
    signup_deadline: string;
    max_signups?: number;
    attendees: { count: number }[];
  };
}

export function EventCard({ event }: EventCardProps) {
  // Truncate description to 120 characters
  const truncatedDescription = event.description.length > 120 
    ? `${event.description.substring(0, 120)}...` 
    : event.description;

  const attendeeCount = event.attendees?.[0]?.count || 0;
  const showAttendees = attendeeCount > 5;

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-200 max-w-sm mx-auto rounded-3xl">
      <div className="aspect-square relative">
        <img
          src={event.image_urls[0]}
          alt={event.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
        />
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{event.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
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
                {attendeeCount} {attendeeCount === 1 ? 'attendee' : 'attendees'}
                {event.max_signups && ` / ${event.max_signups} max`}
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{truncatedDescription}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white group/button rounded-3xl" size="lg">
          <Link href={`/events/${event.id}`} className="flex items-center justify-center">
            View Details
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover/button:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}