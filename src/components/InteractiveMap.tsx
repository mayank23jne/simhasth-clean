import { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

interface InteractiveMapProps {
  latitude: number;
  longitude: number;
  location?: string;
  className?: string;
}

export function InteractiveMap({ latitude, longitude, location, className = "" }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;

    // Simple implementation using OpenStreetMap with Leaflet-like functionality
    // For production, you would use a proper map library like Leaflet or Google Maps
    const initializeMap = () => {
      if (!mapRef.current) return;

      // Create a simple map using OpenStreetMap tiles
      const mapContainer = mapRef.current;
      
      // Clear any existing content
      mapContainer.innerHTML = '';

      // Create iframe with OpenStreetMap embed
      const mapFrame = document.createElement('iframe');
      mapFrame.style.width = '100%';
      mapFrame.style.height = '100%';
      mapFrame.style.border = 'none';
      mapFrame.style.borderRadius = '8px';
      
      // Use OpenStreetMap embed URL
      const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01},${latitude-0.01},${longitude+0.01},${latitude+0.01}&layer=mapnik&marker=${latitude},${longitude}`;
      mapFrame.src = osmUrl;
      
      mapContainer.appendChild(mapFrame);
    };

    // Initialize map after a short delay to ensure DOM is ready
    const timer = setTimeout(initializeMap, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [latitude, longitude]);

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapRef} 
        className="w-full h-full min-h-[300px] bg-muted rounded-lg overflow-hidden"
      >
        {/* Fallback content while map loads */}
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground animate-pulse" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      </div>
      
      {/* Map overlay with location info */}
      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <div className="text-xs">
            <div className="font-medium">{location || 'Report Location'}</div>
            <div className="text-muted-foreground">
              {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </div>
          </div>
        </div>
      </div>
      
      {/* Map controls overlay */}
      <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-sm">
        <div className="flex gap-1">
          <button 
            className="p-1 hover:bg-gray-100 rounded text-xs"
            onClick={() => window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank')}
            title="Open in Google Maps"
          >
            🗺️
          </button>
          <button 
            className="p-1 hover:bg-gray-100 rounded text-xs"
            onClick={() => {
              navigator.clipboard.writeText(`${latitude}, ${longitude}`);
              // You could add a toast notification here
            }}
            title="Copy coordinates"
          >
            📋
          </button>
        </div>
      </div>
    </div>
  );
}

// Alternative simple map component for cases where iframe might not work
export function SimpleMap({ latitude, longitude, location, className = "" }: InteractiveMapProps) {
  const handleOpenInMaps = () => {
    // Try to open in the user's preferred map application
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const appleMapsUrl = `https://maps.apple.com/?q=${latitude},${longitude}`;
    
    // Detect if user is on iOS/Mac for Apple Maps, otherwise use Google Maps
    const isAppleDevice = /iPad|iPhone|iPod|Mac/.test(navigator.userAgent);
    const mapUrl = isAppleDevice ? appleMapsUrl : googleMapsUrl;
    
    window.open(mapUrl, '_blank');
  };

  const handleGetDirections = () => {
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(directionsUrl, '_blank');
  };

  return (
    <div className={`relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-primary/20 ${className}`}>
      <div className="p-6 text-center space-y-4">
        <div className="relative">
          <MapPin className="h-16 w-16 mx-auto text-primary animate-bounce" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
        </div>
        
        <div>
          <h3 className="font-semibold text-lg mb-2">{location || 'Report Location'}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button
            onClick={handleOpenInMaps}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <MapPin className="h-4 w-4" />
            View in Maps
          </button>
          <button
            onClick={handleGetDirections}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
          >
            🧭 Get Directions
          </button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Click "View in Maps" to see the exact location
        </div>
      </div>
    </div>
  );
}
