import type { Metadata } from "next";
import "./globals.css";
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { NavigationServer } from '@/components/navigation-server';

export const metadata: Metadata = {
  title: "Apartment Life",
  description: "Building a Vibrant Community Together",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <div className="min-h-screen bg-background">
          <NavigationServer />
          <main className="container mx-auto px-4 py-8">{children}</main>
          <Toaster />
        </div>
      </body>
    </html>
  );
}