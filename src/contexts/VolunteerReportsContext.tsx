import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface VolunteerReport {
  id: string;
  category: string;
  title: string;
  description: string;
  location: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
  reporter: string;
  status: 'pending' | 'in-progress' | 'resolved';
  gpsCoordinates?: { lat: number; lng: number };
  photos?: string[]; // Array of base64 photo data URLs
  assignedZone?: string; // Zone ID where the report is located
  assignedStaff?: string; // Staff ID assigned to handle this report
  assignedStaffName?: string; // Staff name for display purposes
}

interface VolunteerReportsContextType {
  volunteerReports: VolunteerReport[];
  addVolunteerReport: (
    report: Omit<VolunteerReport, 'id' | 'timestamp' | 'status' | 'assignedZone' | 'assignedStaff' | 'assignedStaffName'>,
    getZoneByCoordinates?: (lat: number, lng: number) => any,
    getAvailableStaffInZone?: (zoneId: string) => any[]
  ) => void;
  updateReportStatus: (id: string, status: 'pending' | 'in-progress' | 'resolved') => void;
  getRecentReports: (limit?: number) => VolunteerReport[];
  getReportsByStatus: (status: 'pending' | 'in-progress' | 'resolved') => VolunteerReport[];
  getReportsByZone: (zoneId: string) => VolunteerReport[];
  getReportsByStaff: (staffId: string) => VolunteerReport[];
  assignReportToStaff: (reportId: string, staffId: string, staffName: string) => void;
}

const VolunteerReportsContext = createContext<VolunteerReportsContextType | undefined>(undefined);

export const useVolunteerReports = () => {
  const context = useContext(VolunteerReportsContext);
  if (!context) {
    throw new Error('useVolunteerReports must be used within a VolunteerReportsProvider');
  }
  return context;
};

interface VolunteerReportsProviderProps {
  children: ReactNode;
}

export const VolunteerReportsProvider: React.FC<VolunteerReportsProviderProps> = ({ children }) => {
  const [volunteerReports, setVolunteerReports] = useState<VolunteerReport[]>([
    // Sample data
    {
      id: 'VR001',
      category: 'overflowing-bin',
      title: 'Overflowing garbage bin at Central Simhastha Area',
      description: 'Large bin overflowing with garbage, attracting flies and creating smell.',
      location: 'Central Park - Block A, Simhastha Grounds, Ujjain',
      priority: 'high',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 mins ago
      reporter: 'Volunteer 1',
      status: 'pending',
      gpsCoordinates: { lat: 22.7196, lng: 75.8577 },
      assignedZone: 'zone1',
      assignedStaff: 'staff1',
      assignedStaffName: 'Raj Kumar',
      photos: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=600&fit=crop&crop=center'
      ]
    },
    {
      id: 'VR002',
      category: 'dirty-toilet',
      title: 'Toilet requires immediate cleaning',
      description: 'Toilet needs thorough cleaning and restocking of supplies.',
      location: 'Mahakal Temple Complex, Ujjain',
      priority: 'medium',
      timestamp: new Date(Date.now() - 32 * 60 * 1000).toISOString(), // 32 mins ago
      reporter: 'Volunteer 2',
      status: 'in-progress',
      gpsCoordinates: { lat: 22.7251, lng: 75.8648 },
      assignedZone: 'zone2',
      assignedStaff: 'staff2',
      assignedStaffName: 'Sunita Patel',
      photos: [
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop&crop=center'
      ]
    },
    {
      id: 'VR003',
      category: 'garbage-pile',
      title: 'Unauthorized garbage dumping',
      description: 'Someone dumped household garbage near the ghat.',
      location: 'Shipra Ghat Area, Ujjain',
      priority: 'medium',
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
      reporter: 'Volunteer 1',
      status: 'resolved',
      gpsCoordinates: { lat: 22.7156, lng: 75.8572 },
      assignedZone: 'zone1',
      assignedStaff: 'staff1',
      assignedStaffName: 'Raj Kumar'
    },
    {
      id: 'VR004',
      category: 'broken-facility',
      title: 'Broken water tap at transport hub',
      description: 'Water tap is broken and water is getting wasted continuously.',
      location: 'Transport Hub, Ujjain Bus Station',
      priority: 'high',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      reporter: 'Volunteer 2',
      status: 'pending',
      gpsCoordinates: { lat: 22.7089, lng: 75.8534 },
      assignedZone: 'zone2',
      assignedStaff: 'staff2',
      assignedStaffName: 'Sunita Patel'
    },
    {
      id: 'VR005',
      category: 'dirty-toilet',
      title: 'Toilet cleaning needed at Shipra Ghat',
      description: 'Toilet facilities need immediate attention and restocking.',
      location: 'Shipra Ghat Area, Ram Ghat, Ujjain',
      priority: 'high',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
      reporter: 'Volunteer 1',
      status: 'pending',
      gpsCoordinates: { lat: 22.7156, lng: 75.8572 },
      assignedZone: 'zone1',
      assignedStaff: 'staff1',
      assignedStaffName: 'Raj Kumar'
    },
    {
      id: 'VR006',
      category: 'overflowing-bin',
      title: 'Garbage bin overflow at Temple Complex',
      description: 'Multiple bins are overflowing near the main temple entrance, causing hygiene issues.',
      location: 'Mahakal Temple Main Entrance, Ujjain',
      priority: 'high',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 mins ago
      reporter: 'Volunteer 2',
      status: 'pending',
      gpsCoordinates: { lat: 22.7251, lng: 75.8648 },
      assignedZone: 'zone2',
      assignedStaff: 'staff2',
      assignedStaffName: 'Sunita Patel',
      photos: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=center'
      ]
    },
    {
      id: 'VR007',
      category: 'dirty-toilet',
      title: 'Toilet maintenance required at Ghat Area',
      description: 'Public toilet facilities need cleaning and supply restocking at the ghat.',
      location: 'Ram Ghat Public Facilities, Ujjain',
      priority: 'medium',
      timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(), // 1.5 hours ago
      reporter: 'Volunteer 2',
      status: 'in-progress',
      gpsCoordinates: { lat: 22.7156, lng: 75.8572 },
      assignedZone: 'zone2',
      assignedStaff: 'staff2',
      assignedStaffName: 'Sunita Patel'
    },
    {
      id: 'VR008',
      category: 'broken-facility',
      title: 'Water dispenser not working',
      description: 'Public water dispenser is broken and needs immediate repair for pilgrims.',
      location: 'Pilgrim Rest Area, Mahakal Complex',
      priority: 'medium',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
      reporter: 'Volunteer 2',
      status: 'resolved',
      gpsCoordinates: { lat: 22.7251, lng: 75.8648 },
      assignedZone: 'zone2',
      assignedStaff: 'staff2',
      assignedStaffName: 'Sunita Patel'
    }
  ]);

  const addVolunteerReport = (
    report: Omit<VolunteerReport, 'id' | 'timestamp' | 'status' | 'assignedZone' | 'assignedStaff' | 'assignedStaffName'>,
    getZoneByCoordinates?: (lat: number, lng: number) => any,
    getAvailableStaffInZone?: (zoneId: string) => any[]
  ) => {
    // Demo: Assign based on volunteer identity for client presentation
    let assignedZone: string | undefined;
    let assignedStaff: string | undefined;
    let assignedStaffName: string | undefined;

    // Check if this is a demo volunteer report and assign accordingly
    const reporterName = report.reporter;
    
    if (reporterName === 'Volunteer 1') {
      // Volunteer 1 reports go to Raj Kumar (Zone 1)
      assignedZone = 'zone1';
      assignedStaff = 'staff1';
      assignedStaffName = 'Raj Kumar';
    } else if (reporterName === 'Volunteer 2') {
      // Volunteer 2 reports go to Sunita Patel (Zone 2)
      assignedZone = 'zone2';
      assignedStaff = 'staff2';
      assignedStaffName = 'Sunita Patel';
    } else if (report.gpsCoordinates && getZoneByCoordinates && getAvailableStaffInZone) {
      // Fallback to GPS-based assignment for other reports
      const zone = getZoneByCoordinates(report.gpsCoordinates.lat, report.gpsCoordinates.lng);
      if (zone) {
        assignedZone = zone.id;
        
        // Find available staff in this zone
        const availableStaff = getAvailableStaffInZone(zone.id);
        if (availableStaff.length > 0) {
          // Assign to the first available staff member
          const selectedStaff = availableStaff[0];
          assignedStaff = selectedStaff.id;
          assignedStaffName = selectedStaff.name;
        }
      }
    }

    const newReport: VolunteerReport = {
      ...report,
      id: `VR${String(volunteerReports.length + 1).padStart(3, '0')}`,
      timestamp: new Date().toISOString(),
      status: 'pending',
      assignedZone,
      assignedStaff,
      assignedStaffName
    };
    
    setVolunteerReports(prev => [newReport, ...prev]);
    
    // Log assignment for debugging
    if (assignedStaff && assignedStaffName) {
      console.log(`Report ${newReport.id} auto-assigned to ${assignedStaffName} in zone ${assignedZone}`);
    }
  };

  const updateReportStatus = (id: string, status: 'pending' | 'in-progress' | 'resolved') => {
    setVolunteerReports(prev => 
      prev.map(report => 
        report.id === id ? { ...report, status } : report
      )
    );
  };

  const getRecentReports = (limit = 10) => {
    return volunteerReports
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  };

  const getReportsByStatus = (status: 'pending' | 'in-progress' | 'resolved') => {
    return volunteerReports.filter(report => report.status === status);
  };

  const getReportsByZone = (zoneId: string) => {
    return volunteerReports.filter(report => report.assignedZone === zoneId);
  };

  const getReportsByStaff = (staffId: string) => {
    return volunteerReports.filter(report => report.assignedStaff === staffId);
  };

  const assignReportToStaff = (reportId: string, staffId: string, staffName: string) => {
    setVolunteerReports(prev => 
      prev.map(report => 
        report.id === reportId 
          ? { ...report, assignedStaff: staffId, assignedStaffName: staffName, status: 'in-progress' }
          : report
      )
    );
  };

  return (
    <VolunteerReportsContext.Provider value={{
      volunteerReports,
      addVolunteerReport,
      updateReportStatus,
      getRecentReports,
      getReportsByStatus,
      getReportsByZone,
      getReportsByStaff,
      assignReportToStaff
    }}>
      {children}
    </VolunteerReportsContext.Provider>
  );
};
