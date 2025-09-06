import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'cleaner' | 'supervisor' | 'maintenance';
  shift: 'morning' | 'afternoon' | 'night';
  status: 'active' | 'inactive' | 'on-leave';
  joinDate: string;
  assignedAreas: string[];
  assignedZones: string[]; // Array of zone IDs
  emergencyContact: string;
  profileImage?: string;
}

interface StaffContextType {
  staff: Staff[];
  addStaff: (staff: Omit<Staff, 'id' | 'joinDate'>) => void;
  updateStaff: (id: string, updates: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;
  getStaffById: (id: string) => Staff | undefined;
  getStaffByName: (name: string) => Staff | undefined;
  getActiveStaff: () => Staff[];
  getStaffByRole: (role: 'cleaner' | 'supervisor' | 'maintenance') => Staff[];
  getStaffByZone: (zoneId: string) => Staff[];
  getAvailableStaffInZone: (zoneId: string) => Staff[];
}

const StaffContext = createContext<StaffContextType | undefined>(undefined);

export const useStaff = () => {
  const context = useContext(StaffContext);
  if (!context) {
    throw new Error('useStaff must be used within a StaffProvider');
  }
  return context;
};

interface StaffProviderProps {
  children: ReactNode;
}

export const StaffProvider: React.FC<StaffProviderProps> = ({ children }) => {
  const [staff, setStaff] = useState<Staff[]>([
    // Sample staff data
    {
      id: 'staff1',
      name: 'Raj Kumar',
      email: 'raj.kumar@cleanspot.com',
      phone: '+91 98765 43210',
      role: 'cleaner',
      shift: 'morning',
      status: 'active',
      joinDate: '2024-01-15',
      assignedAreas: ['Central Park - Block A', 'Market Square'],
      assignedZones: ['zone1', 'zone2'], // Central Simhastha Area, Mahakal Temple Zone
      emergencyContact: '+91 98765 43211',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 'staff2',
      name: 'Sunita Patel',
      email: 'sunita.patel@cleanspot.com',
      phone: '+91 98765 43212',
      role: 'supervisor',
      shift: 'afternoon',
      status: 'active',
      joinDate: '2024-02-01',
      assignedAreas: ['Bus Station', 'Railway Platform'],
      assignedZones: ['zone3', 'zone4'], // Shipra Ghat Area, Transport Hub
      emergencyContact: '+91 98765 43213',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 'staff3',
      name: 'Amit Singh',
      email: 'amit.singh@cleanspot.com',
      phone: '+91 98765 43214',
      role: 'maintenance',
      shift: 'morning',
      status: 'active',
      joinDate: '2024-01-20',
      assignedAreas: ['Community Center', 'Shopping Mall'],
      assignedZones: ['zone5', 'zone6'], // Accommodation Zone, Market Area
      emergencyContact: '+91 98765 43215',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 'staff4',
      name: 'Priya Sharma',
      email: 'priya.sharma@cleanspot.com',
      phone: '+91 98765 43216',
      role: 'cleaner',
      shift: 'night',
      status: 'on-leave',
      joinDate: '2024-03-01',
      assignedAreas: ['Hospital Area', 'School Zone'],
      assignedZones: ['zone7'], // Residential Periphery
      emergencyContact: '+91 98765 43217',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
  ]);

  const addStaff = (newStaff: Omit<Staff, 'id' | 'joinDate'>) => {
    const staff: Staff = {
      ...newStaff,
      id: `staff${Date.now()}`,
      joinDate: new Date().toISOString().split('T')[0]
    };
    setStaff(prev => [...prev, staff]);
  };

  const updateStaff = (id: string, updates: Partial<Staff>) => {
    setStaff(prev => 
      prev.map(member => 
        member.id === id ? { ...member, ...updates } : member
      )
    );
  };

  const deleteStaff = (id: string) => {
    setStaff(prev => prev.filter(member => member.id !== id));
  };

  const getStaffById = (id: string) => {
    return staff.find(member => member.id === id);
  };

  const getStaffByName = (name: string) => {
    return staff.find(member => member.name === name);
  };

  const getActiveStaff = () => {
    return staff.filter(member => member.status === 'active');
  };

  const getStaffByRole = (role: 'cleaner' | 'supervisor' | 'maintenance') => {
    return staff.filter(member => member.role === role);
  };

  const getStaffByZone = (zoneId: string) => {
    return staff.filter(member => member.assignedZones.includes(zoneId));
  };

  const getAvailableStaffInZone = (zoneId: string) => {
    return staff.filter(member => 
      member.assignedZones.includes(zoneId) && 
      member.status === 'active'
    );
  };

  return (
    <StaffContext.Provider value={{
      staff,
      addStaff,
      updateStaff,
      deleteStaff,
      getStaffById,
      getStaffByName,
      getActiveStaff,
      getStaffByRole,
      getStaffByZone,
      getAvailableStaffInZone
    }}>
      {children}
    </StaffContext.Provider>
  );
};
