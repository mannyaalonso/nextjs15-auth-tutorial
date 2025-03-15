"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { createClient } from "@/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EventForm } from "@/components/event-form";

interface Event {
  id: string;
  title: string;
  description: string;
  image_urls: string[];
  event_date: string;
  signup_deadline: string;
  max_signups?: number;
}

interface CreateEventButtonProps {
  editingEvent?: Event | null;
  onClose?: () => void;
}

export function CreateEventButton({ editingEvent, onClose }: CreateEventButtonProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    if (editingEvent) {
      setOpen(true);
    }
  }, [editingEvent]);

  const handleSubmit = async (formData: any) => {
    
    setIsLoading(true);
    
    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        image_urls: [formData.imageUrl, formData.imageUrl, formData.imageUrl],
        event_date: formData.eventDate.toISOString(),
        signup_deadline: formData.signupDeadline.toISOString(),
        max_signups: formData.maxSignups ? parseInt(formData.maxSignups) : null,
        qr_code_url: formData.imageUrl, // Use the image URL as QR code URL for now
      };

      if (editingEvent) {
        const { error } = await supabase
          .from("events")
          .update(eventData)
          .eq("id", editingEvent.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Event updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from("events")
          .insert(eventData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Event created successfully.",
        });
      }

      setOpen(false);
      if (onClose) onClose();
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to ${editingEvent ? 'update' : 'create'} event. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && onClose) {
      onClose();
    }
  };

  const initialData = editingEvent ? {
    title: editingEvent.title,
    description: editingEvent.description,
    imageUrl: editingEvent.image_urls[0] || "",
    eventDate: new Date(editingEvent.event_date),
    signupDeadline: new Date(editingEvent.signup_deadline),
    maxSignups: editingEvent.max_signups?.toString() || "",
  } : undefined;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-3xl"
          onClick={() => setOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="z-10 pb-4 border-b">
          <DialogTitle className="text-xl font-semibold">
            {editingEvent ? 'Edit Event' : 'Create New Event'}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <EventForm
            initialData={initialData}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            mode={editingEvent ? "edit" : "create"}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}