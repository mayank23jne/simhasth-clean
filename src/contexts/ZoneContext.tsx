import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Zone {
  id: string;
  name: string;
  description: string;
  coordinates: {
    center: { lat: number; lng: number };
    radius: number; // in meters
  };
  color: string; // for map visualization
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

interface ZoneContextType {
  zones: Zone[];
  addZone: (zone: Omit<Zone, 'id' | 'createdAt'>) => void;
  updateZone: (id: string, updates: Partial<Omit<Zone, 'id'>>) => void;
  deleteZone: (id: string) => void;
  getZoneById: (id: string) => Zone | undefined;
  getZoneByCoordinates: (lat: number, lng: number) => Zone | null;
  getZonesByPriority: (priority: 'high' | 'medium' | 'low') => Zone[];
}

const ZoneContext = createContext<ZoneContextType | undefined>(undefined);

export const useZone = () => {
  const context = useContext(ZoneContext);
  if (!context) {
    throw new Error('useZone must be used within a ZoneProvider');
  }
  return context;
};

interface ZoneProviderProps {
  children: ReactNode;
}

export const ZoneProvider: React.FC<ZoneProviderProps> = ({ children }) => {
  const [zones, setZones] = useState<Zone[]>([
    // Sample zones for Ujjain/Simhastha
    {
      id: 'zone1',
      name: 'Central Simhastha Area',
      description: 'Main event area with high visitor density',
      coordinates: {
        center: { lat: 22.7196, lng: 75.8577 },
        radius: 1000
      },
      color: '#ef4444',
      priority: 'high',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'zone2',
      name: 'Mahakal Temple Zone',
      description: 'Temple area and surrounding facilities',
      coordinates: {
        center: { lat: 22.7251, lng: 75.8648 },
        radius: 800
      },
      color: '#f97316',
      priority: 'high',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'zone3',
      name: 'Shipra Ghat Area',
      description: 'River bathing ghats and nearby facilities',
      coordinates: {
        center: { lat: 22.7156, lng: 75.8572 },
        radius: 600
      },
      color: '#3b82f6',
      priority: 'high',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'zone4',
      name: 'Transport Hub',
      description: 'Bus station, railway station, and parking areas',
      coordinates: {
        center: { lat: 22.7089, lng: 75.8534 },
        radius: 1200
      },
      color: '#10b981',
      priority: 'medium',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'zone5',
      name: 'Accommodation Zone',
      description: 'Hotels, dharamshalas, and temporary accommodations',
      coordinates: {
        center: { lat: 22.7300, lng: 75.8700 },
        radius: 1500
      },
      color: '#8b5cf6',
      priority: 'medium',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'zone6',
      name: 'Market Area',
      description: 'Shopping areas and commercial zones',
      coordinates: {
        center: { lat: 22.7120, lng: 75.8620 },
        radius: 800
      },
      color: '#f59e0b',
      priority: 'medium',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'zone7',
      name: 'Residential Periphery',
      description: 'Outer residential areas and suburbs',
      coordinates: {
        center: { lat: 22.7400, lng: 75.8400 },
        radius: 2000
      },
      color: '#6b7280',
      priority: 'low',
      createdAt: '2024-01-01T00:00:00Z'
    }
  ]);

  const addZone = (zone: Omit<Zone, 'id' | 'createdAt'>) => {
    const newZone: Zone = {
      ...zone,
      id: `zone${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setZones(prev => [...prev, newZone]);
  };

  const updateZone = (id: string, updates: Partial<Omit<Zone, 'id'>>) => {
    setZones(prev => 
      prev.map(zone => 
        zone.id === id ? { ...zone, ...updates } : zone
      )
    );
  };

  const deleteZone = (id: string) => {
    setZones(prev => prev.filter(zone => zone.id !== id));
  };

  const getZoneById = (id: string) => {
    return zones.find(zone => zone.id === id);
  };

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  const getZoneByCoordinates = (lat: number, lng: number): Zone | null => {
    // Find the zone that contains these coordinates
    for (const zone of zones) {
      const distance = calculateDistance(
        lat, lng,
        zone.coordinates.center.lat,
        zone.coordinates.center.lng
      );
      
      if (distance <= zone.coordinates.radius) {
        return zone;
      }
    }
    
    // If no zone contains the coordinates, return the nearest zone
    let nearestZone = zones[0];
    let minDistance = calculateDistance(
      lat, lng,
      zones[0].coordinates.center.lat,
      zones[0].coordinates.center.lng
    );

    for (const zone of zones.slice(1)) {
      const distance = calculateDistance(
        lat, lng,
        zone.coordinates.center.lat,
        zone.coordinates.center.lng
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        nearestZone = zone;
      }
    }

    return nearestZone;
  };

  const getZonesByPriority = (priority: 'high' | 'medium' | 'low') => {
    return zones.filter(zone => zone.priority === priority);
  };

  return (
    <ZoneContext.Provider value={{
      zones,
      addZone,
      updateZone,
      deleteZone,
      getZoneById,
      getZoneByCoordinates,
      getZonesByPriority
    }}>
      {children}
    </ZoneContext.Provider>
  );
};
