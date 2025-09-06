import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

// Google Maps type declarations
declare global {
  interface Window {
    google: {
      maps: {
        Map: any;
        Marker: any;
        MapTypeId: {
          ROADMAP: string;
        };
      };
    };
  }
}

interface MapViewProps {
  latitude: number;
  longitude: number;
  address?: string;
}

const MapView: React.FC<MapViewProps> = ({ latitude, longitude, address }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const googleApiKey = 'AIzaSyCnhWZO9IIbvcCJVQxDZu1SOeEiyFgpl54';

  useEffect(() => {
    if (mapLoaded) return;

    // Load Google Maps API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setMapLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [mapLoaded]);

  useEffect(() => {
    if (!mapContainer.current || !mapLoaded || !window.google) return;

    // Initialize Google Map
    const map = new window.google.maps.Map(mapContainer.current, {
      center: { lat: latitude, lng: longitude },
      zoom: 15,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
    });

    // Add marker
    new window.google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map: map,
      title: address || 'Location',
    });

  }, [latitude, longitude, mapLoaded, address]);

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location on Map
        </CardTitle>
        {address && (
          <p className="text-sm text-muted-foreground">{address}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-64 rounded-lg overflow-hidden">
          <div ref={mapContainer} className="absolute inset-0" />
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </div>
      </CardContent>
    </Card>
  );
};

export default MapView;