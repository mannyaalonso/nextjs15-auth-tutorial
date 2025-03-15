"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { DateTimePicker } from "@/components/date-time-picker";

interface EventFormProps {
  initialData?: {
    title: string;
    description: string;
    imageUrl: string;
    eventDate: Date;
    signupDeadline: Date;
    maxSignups: string;
  };
  onSubmit: (formData: any) => Promise<void>;
  isLoading: boolean;
  mode: "create" | "edit";
}

export function EventForm({ initialData, onSubmit, isLoading, mode }: EventFormProps) {
  const getInitialDate = () => {
    const date = new Date();
    date.setMinutes(Math.ceil(date.getMinutes() / 15) * 15);
    return date;
  };

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    imageUrl: initialData?.imageUrl || "",
    eventDate: initialData?.eventDate || getInitialDate(),
    signupDeadline: initialData?.signupDeadline || getInitialDate(),
    maxSignups: initialData?.maxSignups || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white">
      <div className="space-y-4">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="min-h-[100px]"
          required
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          placeholder="https://example.com/image.jpg"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Label>Event Date & Time</Label>
          <DateTimePicker
            date={formData.eventDate}
            onDateChange={(date) => setFormData({ ...formData, eventDate: date })}
          />
        </div>

        <div className="space-y-4">
          <Label>Signup Deadline</Label>
          <DateTimePicker
            date={formData.signupDeadline}
            onDateChange={(date) => setFormData({ ...formData, signupDeadline: date })}
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label htmlFor="maxSignups">Maximum Signups (Optional)</Label>
        <Input
          id="maxSignups"
          type="number"
          value={formData.maxSignups}
          onChange={(e) => setFormData({ ...formData, maxSignups: e.target.value })}
          min="1"
          placeholder="Leave empty for unlimited"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-3xl"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {mode === "edit" ? "Updating..." : "Creating..."}
          </>
        ) : (
          mode === "edit" ? "Update Event" : "Create Event"
        )}
      </Button>
    </form>
  );
}