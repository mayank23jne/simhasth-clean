import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Toilet {
  id: string;
  name: string;
  location: string;
  address: string;
  staffAssigned: string[];
  zoneId: string; // Zone this toilet belongs to
  status: 'operational' | 'maintenance' | 'out-of-order';
  lastCleaned: string;
  cleaningFrequency: 'hourly' | 'daily' | 'weekly';
  facilities: string[];
  capacity: number;
  qrCode: string;
  coordinates?: { lat: number; lng: number };
}

interface ToiletContextType {
  toilets: Toilet[];
  getToiletById: (id: string) => Toilet | undefined;
  getToiletsByStatus: (status: 'operational' | 'maintenance' | 'out-of-order') => Toilet[];
  getToiletsByStaff: (staffId: string) => Toilet[];
  getToiletsByZone: (zoneId: string) => Toilet[];
  addToilet: (toilet: Omit<Toilet, 'id'>) => void;
  updateToilet: (id: string, toilet: Partial<Omit<Toilet, 'id'>>) => void;
  updateToiletStatus: (id: string, status: 'operational' | 'maintenance' | 'out-of-order') => void;
  assignStaffToToilet: (toiletId: string, staffId: string) => void;
  removeStaffFromToilet: (toiletId: string, staffId: string) => void;
}

const ToiletContext = createContext<ToiletContextType | undefined>(undefined);

export const useToilet = () => {
  const context = useContext(ToiletContext);
  if (!context) {
    throw new Error('useToilet must be used within a ToiletProvider');
  }
  return context;
};

interface ToiletProviderProps {
  children: ReactNode;
}

export const ToiletProvider: React.FC<ToiletProviderProps> = ({ children }) => {
  const [toilets, setToilets] = useState<Toilet[]>([
    {
      id: 'T001',
      name: 'Central Park Public Restroom',
      location: 'Central Park - Block A',
      address: 'Central Park, Simhastha Grounds, Ujjain',
      staffAssigned: ['staff1'],
      zoneId: 'zone1', // Central Simhastha Area
      status: 'operational',
      lastCleaned: '2024-01-15T10:30:00Z',
      cleaningFrequency: 'hourly',
      facilities: ['Male', 'Female', 'Disabled Access', 'Baby Changing'],
      capacity: 20,
      qrCode: 'CSG001A',
      coordinates: { lat: 22.7196, lng: 75.8577 }
    },
    {
      id: 'T002',
      name: 'Mahakal Temple Restroom',
      location: 'Mahakal Temple Complex',
      address: 'Mahakal Temple, Ujjain',
      staffAssigned: ['staff1'],
      zoneId: 'zone2', // Mahakal Temple Zone
      status: 'operational',
      lastCleaned: '2024-01-15T09:45:00Z',
      cleaningFrequency: 'hourly',
      facilities: ['Male', 'Female', 'Disabled Access'],
      capacity: 15,
      qrCode: 'CSG002B',
      coordinates: { lat: 22.7251, lng: 75.8648 }
    },
    {
      id: 'T003',
      name: 'Shipra Ghat Facilities',
      location: 'Shipra Ghat',
      address: 'Ram Ghat, Shipra River, Ujjain',
      staffAssigned: ['staff2'],
      zoneId: 'zone3', // Shipra Ghat Area
      status: 'maintenance',
      lastCleaned: '2024-01-15T08:15:00Z',
      cleaningFrequency: 'hourly',
      facilities: ['Male', 'Female', 'Disabled Access', 'Baby Changing', 'Shower'],
      capacity: 30,
      qrCode: 'CSG003C',
      coordinates: { lat: 22.7156, lng: 75.8572 }
    },
    {
      id: 'T004',
      name: 'Transport Hub Restroom',
      location: 'Bus Station',
      address: 'Ujjain Bus Station, Platform 1',
      staffAssigned: ['staff2'],
      zoneId: 'zone4', // Transport Hub
      status: 'operational',
      lastCleaned: '2024-01-15T07:30:00Z',
      cleaningFrequency: 'hourly',
      facilities: ['Male', 'Female', 'Disabled Access'],
      capacity: 25,
      qrCode: 'CSG004D',
      coordinates: { lat: 22.7089, lng: 75.8534 }
    },
    {
      id: 'T005',
      name: 'Accommodation Area Restroom',
      location: 'Dharamshala Complex',
      address: 'Pilgrim Accommodation, Ujjain',
      staffAssigned: ['staff3'],
      zoneId: 'zone5', // Accommodation Zone
      status: 'operational',
      lastCleaned: '2024-01-15T11:00:00Z',
      cleaningFrequency: 'daily',
      facilities: ['Male', 'Female', 'Disabled Access', 'Baby Changing', 'Family Room'],
      capacity: 40,
      qrCode: 'CSG005E',
      coordinates: { lat: 22.7300, lng: 75.8700 }
    },
    {
      id: 'T006',
      name: 'Market Area Restroom',
      location: 'Main Market',
      address: 'Sarafa Bazaar, Ujjain',
      staffAssigned: ['staff3'],
      zoneId: 'zone6', // Market Area
      status: 'out-of-order',
      lastCleaned: '2024-01-14T16:20:00Z',
      cleaningFrequency: 'daily',
      facilities: ['Male', 'Female', 'Disabled Access'],
      capacity: 12,
      qrCode: 'CSG006F',
      coordinates: { lat: 22.7120, lng: 75.8620 }
    },
    {
      id: 'T007',
      name: 'Residential Area Restroom',
      location: 'Residential Periphery',
      address: 'Outer Ujjain Residential Area',
      staffAssigned: ['staff4'],
      zoneId: 'zone7', // Residential Periphery
      status: 'operational',
      lastCleaned: '2024-01-15T12:15:00Z',
      cleaningFrequency: 'daily',
      facilities: ['Male', 'Female', 'Disabled Access'],
      capacity: 18,
      qrCode: 'CSG007G',
      coordinates: { lat: 22.7400, lng: 75.8400 }
    }
  ]);

  const getToiletById = (id: string) => {
    return toilets.find(toilet => toilet.id === id);
  };

  const getToiletsByStatus = (status: 'operational' | 'maintenance' | 'out-of-order') => {
    return toilets.filter(toilet => toilet.status === status);
  };

  const getToiletsByStaff = (staffId: string) => {
    return toilets.filter(toilet => toilet.staffAssigned.includes(staffId));
  };

  const getToiletsByZone = (zoneId: string) => {
    return toilets.filter(toilet => toilet.zoneId === zoneId);
  };

  const addToilet = (toilet: Omit<Toilet, 'id'>) => {
    const newId = `T${String(toilets.length + 1).padStart(3, '0')}`;
    const newToilet: Toilet = {
      ...toilet,
      id: newId
    };
    setToilets(prev => [...prev, newToilet]);
  };

  const updateToilet = (id: string, updatedToilet: Partial<Omit<Toilet, 'id'>>) => {
    setToilets(prev => 
      prev.map(toilet => 
        toilet.id === id ? { ...toilet, ...updatedToilet } : toilet
      )
    );
  };

  const updateToiletStatus = (id: string, status: 'operational' | 'maintenance' | 'out-of-order') => {
    setToilets(prev => 
      prev.map(toilet => 
        toilet.id === id ? { ...toilet, status } : toilet
      )
    );
  };

  const assignStaffToToilet = (toiletId: string, staffId: string) => {
    setToilets(prev => 
      prev.map(toilet => 
        toilet.id === toiletId && !toilet.staffAssigned.includes(staffId)
          ? { ...toilet, staffAssigned: [...toilet.staffAssigned, staffId] }
          : toilet
      )
    );
  };

  const removeStaffFromToilet = (toiletId: string, staffId: string) => {
    setToilets(prev => 
      prev.map(toilet => 
        toilet.id === toiletId
          ? { ...toilet, staffAssigned: toilet.staffAssigned.filter(id => id !== staffId) }
          : toilet
      )
    );
  };

  return (
    <ToiletContext.Provider value={{
      toilets,
      getToiletById,
      getToiletsByStatus,
      getToiletsByStaff,
      getToiletsByZone,
      addToilet,
      updateToilet,
      updateToiletStatus,
      assignStaffToToilet,
      removeStaffFromToilet
    }}>
      {children}
    </ToiletContext.Provider>
  );
};
