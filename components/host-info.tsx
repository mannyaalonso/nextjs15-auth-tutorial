"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";

const images = [
  "https://mhzjfcysmn.ufs.sh/f/Y6HoS0sTXJs5eCh3wmqKxa3GZY42gir106dQBfV5PXFh8ALR",
  "https://mhzjfcysmn.ufs.sh/f/Y6HoS0sTXJs5B9RVVfaUrLsGPXt5yzvlOKQbnSR1IxTgfZJj",
  "https://mhzjfcysmn.ufs.sh/f/Y6HoS0sTXJs57elLNWStgGI4oXfQh0w8HLDPkpWjRMsTZECK",
  "https://mhzjfcysmn.ufs.sh/f/Y6HoS0sTXJs5SFk6YlET82nrt1kXbV9FyjscBoCveLKNH4iI"
];

export function HostInfo() {
  const [emblaRef] = useEmblaCarousel({ loop: true });

  return (
    <Card className="bg-gradient-to-b border-none from-blue-50 to-white max-w-7xl mx-auto rounded-3xl shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-blue-800">
          Meet Your Hosts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Carousel Section */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Carousel
              ref={emblaRef}
              className="w-full"
            >
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-[4/3] overflow-hidden rounded-3xl border-2 border-blue-200">
                      <img
                        src={image}
                        alt={`Manny and Ashley - Photo ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 bg-white/80 hover:bg-white" />
              <CarouselNext className="right-2 bg-white/80 hover:bg-white" />
            </Carousel>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-blue-900">
              Manny & Ashley
            </h3>
            <p className="text-sm text-blue-800/80 mt-1">
              Your Neighbors & Community Hosts
            </p>
          </div>
          
          <div className="space-y-4 text-blue-700 leading-relaxed">
            <p>
              Hey neighbors! We're Manny and Ashley, and we're thrilled to be part 
              of this amazing community. As residents ourselves, we're passionate 
              about bringing our community together and creating meaningful 
              connections with our neighbors.
            </p>
            
            <p>
              We believe that the best communities are built on friendship, shared 
              experiences, and fun moments together. That's why we love organizing 
              these events - they give us all a chance to step away from our busy 
              lives, meet new friends, and create lasting memories.
            </p>
            
            <p>
              Whether it's a casual game night, a community barbecue, or a holiday 
              celebration, our goal is to make every event welcoming and enjoyable 
              for everyone. We'd be delighted to have you join us and get to know 
              you better!
            </p>
            
            <p className="text-blue-600 font-medium">
              Looking forward to seeing you at our next event!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}