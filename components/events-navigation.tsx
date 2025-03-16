"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";

export function EventsNavigation() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex gap-4">
      <Button
        variant="outline"
        className="rounded-full"
        onClick={() => scrollToSection('upcoming')}
      >
        <Calendar className="mr-2 h-4 w-4" />
        Upcoming Events
      </Button>
      <Button
        variant="outline"
        className="rounded-full"
        onClick={() => scrollToSection('past')}
      >
        <Clock className="mr-2 h-4 w-4" />
        Past Events
      </Button>
    </div>
  );
}