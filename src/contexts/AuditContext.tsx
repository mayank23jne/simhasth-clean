import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface AuditReport {
  id: string;
  facilityId: string;
  facilityLocation: string;
  staffId: string;
  staffName: string;
  cleaningType: string;
  issues: string;
  notes: string;
  timestamp: string;
  qrCode: string;
  status: 'completed' | 'issues-found';
  photos?: string[];
  coordinates?: { lat: number; lng: number };
}

interface AuditContextType {
  auditReports: AuditReport[];
  addAuditReport: (report: Omit<AuditReport, 'id' | 'timestamp'>) => void;
  getAuditsByStaff: (staffId: string) => AuditReport[];
  getRecentAudits: (limit?: number) => AuditReport[];
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

export const useAudit = () => {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error('useAudit must be used within an AuditProvider');
  }
  return context;
};

interface AuditProviderProps {
  children: ReactNode;
}

export const AuditProvider: React.FC<AuditProviderProps> = ({ children }) => {
  const [auditReports, setAuditReports] = useState<AuditReport[]>([
    // Sample data
    {
      id: 'AUD001',
      facilityId: 'T001',
      facilityLocation: 'Central Park - Block A, Simhastha Grounds, Ujjain (22.719654, 75.857832)',
      staffId: 'staff1',
      staffName: 'Raj Kumar',
      cleaningType: 'routine',
      issues: '',
      notes: 'Cleaning confirmation completed via mobile app',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      qrCode: 'CSG001A',
      status: 'completed',
      photos: [
        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
      ]
    },
    {
      id: 'AUD002',
      facilityId: 'T005',
      facilityLocation: 'Shopping Mall - Block B, Simhastha Grounds, Ujjain (22.715623, 75.857245)',
      staffId: 'staff2',
      staffName: 'Sunita Patel',
      cleaningType: 'routine',
      issues: '',
      notes: 'Cleaning confirmation completed via mobile app',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      qrCode: 'CSG005A',
      status: 'completed',
      photos: [
        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
      ]
    },
    {
      id: 'AUD003',
      facilityId: 'T003',
      facilityLocation: 'Bus Station - Platform 2, Simhastha Grounds, Ujjain (22.716891, 75.856734)',
      staffId: 'staff1',
      staffName: 'Raj Kumar',
      cleaningType: 'routine',
      issues: '',
      notes: 'Cleaning confirmation completed via mobile app',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      qrCode: 'CSG003A',
      status: 'completed'
    }
  ]);

  const addAuditReport = (report: Omit<AuditReport, 'id' | 'timestamp'>) => {
    console.log('AuditContext: Adding new audit report with photos:', report.photos?.length || 0);
    const newReport: AuditReport = {
      ...report,
      id: `AUD${String(auditReports.length + 1).padStart(3, '0')}`,
      timestamp: new Date().toISOString()
    };
    console.log('AuditContext: New report created:', newReport.id, 'with photos:', newReport.photos?.length || 0);
    setAuditReports(prev => [newReport, ...prev]);
  };

  const getAuditsByStaff = (staffId: string) => {
    return auditReports.filter(report => report.staffId === staffId);
  };

  const getRecentAudits = (limit = 10) => {
    return auditReports
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  };

  return (
    <AuditContext.Provider value={{
      auditReports,
      addAuditReport,
      getAuditsByStaff,
      getRecentAudits
    }}>
      {children}
    </AuditContext.Provider>
  );
};
