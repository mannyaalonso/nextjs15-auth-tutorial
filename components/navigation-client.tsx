"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar, Home, User, Info } from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface NavigationClientProps {
  user: SupabaseUser | null;
}


export function NavigationClient({ user }: NavigationClientProps) {
  const pathname = usePathname();
  const userRole = user?.role || 'default-role';

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Calendar className="h-6 w-6" />
            <span className="text-lg font-bold hidden md:inline">Apartment Events</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Button
              variant={pathname === "/" ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link href="/" className="md:w-auto">
                <Home className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Home</span>
              </Link>
            </Button>

            <Button
              variant={pathname === "/profile" ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link href="/profile" className="md:w-auto">
                <User className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Profile</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}