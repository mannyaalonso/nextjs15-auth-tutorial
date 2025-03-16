import { redirect } from "next/navigation";
import { format } from "date-fns";
import { createClient } from "@/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateEventButton } from "@/components/create-event-button";
import { EventActions } from "@/components/event-actions";
import { getUser } from "@/queries/user";

async function checkAdminAccess() {
    const supabase = await createClient()
    const user = await getUser();

    if (!user) {
      redirect("/sign-in");
    }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== 'admin') {
    redirect("/");
  }
}

async function getEvents() {
  const supabase = await createClient();
  const { data: events, error } = await supabase
    .from("events")
    .select(`
      *,
      signups: signups(count),
      attendees: attendees(count)
    `)
    .order("event_date", { ascending: false });

  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }

  // Sort events: upcoming first (ascending), then past events (descending)
  return events.sort((a, b) => {
    const dateA = new Date(a.event_date);
    const dateB = new Date(b.event_date);
    const now = new Date();
    const isAUpcoming = dateA >= now;
    const isBUpcoming = dateB >= now;

    if (isAUpcoming && !isBUpcoming) return -1;
    if (!isAUpcoming && isBUpcoming) return 1;
    if (isAUpcoming) return dateA.getTime() - dateB.getTime();
    return dateB.getTime() - dateA.getTime();
  });
}

export default async function AdminPage() {
  await checkAdminAccess();
  const events = await getEvents();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Event Management</h1>
        <CreateEventButton />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Signups</TableHead>
              <TableHead>Attendance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell>
                  {format(new Date(event.event_date), "PPP")}
                </TableCell>
                <TableCell>
                  {event.signups[0]?.count || 0}
                  {event.max_signups && ` / ${event.max_signups}`}
                </TableCell>
                <TableCell>{event.attendees[0]?.count || 0}</TableCell>
                <TableCell>
                  {new Date(event.event_date) < new Date()
                    ? "Past"
                    : new Date(event.signup_deadline) < new Date()
                    ? "Registration Closed"
                    : "Active"}
                </TableCell>
                <TableCell className="text-right">
                  <EventActions event={event} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}