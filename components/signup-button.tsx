"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";



interface SignupButtonProps {
  user: SupabaseUser | null;
  eventId: string;
  isDeadlinePassed: boolean;
  isFull: boolean;
  userSignup?: {
    id: string;
    canceled: boolean;
  } | null;
}

export function SignupButton({
  user,
  eventId,
  isDeadlinePassed,
  isFull,
  userSignup,
}: SignupButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const handleSignup = async () => {
    setIsLoading(true);
    try {
      if (userSignup?.canceled) {
        const { error } = await supabase
          .from("signups")
          .update({ canceled: false })
          .eq("id", userSignup.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("signups").insert({
          event_id: eventId,
          user_id: user?.id
        });

        if (error) throw error;
      }

      toast({
        title: "Success!",
        description: "You've successfully signed up for this event.",
      });
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign up for the event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!userSignup) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("signups")
        .update({ canceled: true })
        .eq("id", userSignup.id);

      if (error) throw error;

      toast({
        title: "Canceled",
        description: "Your registration has been canceled.",
      });
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isDeadlinePassed) {
    return (
      <Button disabled className="w-full h-16 text-lg text-white rounded-3xl">
        Registration closed
      </Button>
    );
  }

  if (isFull && !userSignup) {
    return (
      <Button disabled className="w-full h-16 text-lg text-white rounded-3xl">
        Event is full
      </Button>
    );
  }

  if (userSignup && !userSignup.canceled) {
    return (
      <Button
        variant="destructive"
        className="w-full h-16 text-lg bg-red-600 hover:bg-red-700 text-white rounded-3xl"
        onClick={handleCancel}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Canceling...
          </>
        ) : (
          "Cancel Registration"
        )}
      </Button>
    );
  }

  return (
    <Button
      className="w-full h-16 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-3xl"
      onClick={handleSignup}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          {userSignup?.canceled ? "Rejoining..." : "Signing up..."}
        </>
      ) : (
        userSignup?.canceled ? "Rejoin Event" : "One-Click Sign Up"
      )}
    </Button>
  );
}
