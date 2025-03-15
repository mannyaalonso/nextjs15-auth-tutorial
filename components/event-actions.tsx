"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Lock, Unlock } from "lucide-react";
import { createClient } from "@/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EventActionsProps {
  event: {
    id: string;
    attendance_locked: boolean;
  };
}

export function EventActions({ event }: EventActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const supabase = createClient()

  const toggleAttendanceLock = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("events")
        .update({ attendance_locked: !event.attendance_locked })
        .eq("id", event.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Attendance ${
          event.attendance_locked ? "unlocked" : "locked"
        } successfully.`,
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update attendance lock status.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={toggleAttendanceLock}
          disabled={isLoading}
        >
          {event.attendance_locked ? (
            <>
              <Unlock className="mr-2 h-4 w-4" />
              Unlock Attendance
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Lock Attendance
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}