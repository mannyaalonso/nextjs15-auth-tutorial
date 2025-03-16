"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar, Home, User, UserCog } from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { SVGLogo } from "@/components/svg-logo"

interface NavigationClientProps {
  user: SupabaseUser | null;
}


export function NavigationClient({ user }: NavigationClientProps) {
  const pathname = usePathname();
  const userRole = user?.role || 'tenant';

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <SVGLogo />
            <span className="text-lg font-bold hidden md:inline">Flock</span>
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
              variant={pathname === "/events" ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link href="/events" className="md:w-auto">
                <Calendar className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Events</span>
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

            {userRole === 'admin' &&
            <Button
              variant={pathname === "/admin" ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link href="/admin" className="md:w-auto">
                <UserCog className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Admin</span>
              </Link>
            </Button>}
          </div>
        </div>
      </div>
    </nav>
  );
}