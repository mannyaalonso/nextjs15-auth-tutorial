"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/supabase/client";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { signOut } from "./auth-actions";

interface ProfileHeaderProps {
  profile: {
    id: string;
    name: string;
    apartment_number: string;
    profile_picture?: string;
  };
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [apartmentNumber, setApartmentNumber] = useState(profile.apartment_number);
  const [isLoading, setIsLoading] = useState(false);

  const handleApartmentNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    setApartmentNumber(value);
  };

  const handleSubmit = async () => {
    if (!apartmentNumber) {
      toast({
        title: "Error",
        description: "Please enter an apartment number.",
        variant: "destructive",
      });
      return;
    }

    
    setIsLoading(true);
    try {
      // Use mock user ID directly instead of getting it from auth
      const { error: updateError } = await supabase
        .from("users")
        .update({ apartment_number: apartmentNumber })
        .eq("id", profile.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Apartment number updated successfully.",
      });
      setIsEditing(false);
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update apartment number.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <div className="flex items-center justify-between rounded-3xl">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.profile_picture} />
              <AvatarFallback>
                {profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{profile.name}</CardTitle>
              <div className="mt-1 space-y-2">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  {isEditing ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="text"
                        value={apartmentNumber}
                        onChange={handleApartmentNumberChange}
                        className="w-24 h-8 rounded-3xl"
                        placeholder="Enter #"
                        autoFocus
                        disabled={isLoading}
                      />
                      <Button
                        size="sm"
                        onClick={handleSubmit}
                        className="bg-blue-600 hover:bg-blue-700 text-white h-8 rounded-3xl"
                        disabled={isLoading}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setApartmentNumber(profile.apartment_number);
                        }}
                        className="h-8 rounded-3xl"
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <span 
                      onClick={() => setIsEditing(true)}
                      className="cursor-pointer hover:text-blue-600 transition-colors"
                    >
                      Apartment {apartmentNumber || "number"}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground italic">
                  Note: Only event organizers can see your apartment number
                </p>
              </div>
            </div>
          </div>
          <Button className="rounded-3xl" variant="outline" onClick={signOut}>
            Sign Out
          </Button>
    
        </div>
      </CardHeader>
    </Card>
  );
}