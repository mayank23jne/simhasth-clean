import { useState } from "react";
import { Login } from "@/components/Login";
import { Navigation } from "@/components/Navigation";
import { Dashboard } from "@/components/Dashboard";
import { QRAudit } from "@/components/QRaudit";
import { Reports } from "@/components/Reports";
import { Scanner } from "@/components/Scanner";
import { StaffTaskReports } from "@/components/StaffAuditReports";
import { StaffManagement } from "@/components/StaffManagement";
import { ToiletManagement } from "@/components/ToiletManagement";
import { ZoneManagement } from "@/components/ZoneManagement";
import { ReportDetailPage } from "@/components/ReportDetailPage";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<"volunteer" | "staff" | "admin">("volunteer");
  const [loggedInUser, setLoggedInUser] = useState<{ username: string; name: string } | null>(null);
  const [activeTab, setActiveTab] = useState("scanner");
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showReportDetail, setShowReportDetail] = useState(false);
  const [scannedLocationData, setScannedLocationData] = useState<{ location: string; coordinates: { lat: number; lng: number } } | null>(null);
  const [isReturningFromDetail, setIsReturningFromDetail] = useState(false);

  const handleLogin = (type: "volunteer" | "staff" | "admin", userDetails?: { username: string; name: string }) => {
    setUserType(type);
    setLoggedInUser(userDetails || null);
    setIsLoggedIn(true);
    // Set default tab based on user type
    if (type === "staff") {
      setActiveTab("reports"); // Show assigned reports by default for staff
    } else if (type === "admin") {
      setActiveTab("dashboard");
    } else {
      setActiveTab("scanner");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInUser(null);
    setActiveTab("scanner");
    setSelectedReport(null);
    setShowReportDetail(false);
  };

  const handleViewReportDetail = (report: any) => {
    setSelectedReport(report);
    setShowReportDetail(true);
    setIsReturningFromDetail(false);
  };

  const handleBackToReports = () => {
    setSelectedReport(null);
    setShowReportDetail(false);
    setIsReturningFromDetail(true);
    // Reset the flag after a short delay
    setTimeout(() => setIsReturningFromDetail(false), 100);
  };

  const handleCompleteReport = (reportId: string) => {
    // Handle report completion logic here
    console.log('Completing report:', reportId);
    // You can add the actual completion logic here
  };

  const handleScanComplete = (locationData?: { location: string; coordinates: { lat: number; lng: number } }) => {
    // Store the scanned location data
    if (locationData) {
      setScannedLocationData(locationData);
    }
    // Navigate to reports
    setActiveTab("reports");
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    // Show report detail page if a report is selected
    if (showReportDetail && selectedReport) {
      return (
        <ReportDetailPage 
          report={selectedReport}
          onBack={handleBackToReports}
          onCompleteReport={handleCompleteReport}
        />
      );
    }

    switch (activeTab) {
      case "qr-audit":
        return userType === "staff" ? <QRAudit loggedInUser={loggedInUser} /> : <Scanner onScanComplete={handleScanComplete} />;
      case "scanner":
        return <Scanner onScanComplete={handleScanComplete} />;
      case "reports":
        return <Reports userType={userType} onViewReportDetail={handleViewReportDetail} scannedLocationData={scannedLocationData} loggedInUser={loggedInUser} isReturningFromDetail={isReturningFromDetail} />;
      case "dashboard":
        return userType === "admin" ? <Dashboard /> : <Reports userType={userType} onViewReportDetail={handleViewReportDetail} scannedLocationData={scannedLocationData} isReturningFromDetail={isReturningFromDetail} />;
      case "volunteer-reports":
        return userType === "admin" ? <Reports userType={userType} onViewReportDetail={handleViewReportDetail} scannedLocationData={scannedLocationData} isReturningFromDetail={isReturningFromDetail} /> : <Reports userType={userType} onViewReportDetail={handleViewReportDetail} scannedLocationData={scannedLocationData} isReturningFromDetail={isReturningFromDetail} />;
      case "staff-audits":
        return userType === "admin" ? <StaffTaskReports /> : <Reports userType={userType} onViewReportDetail={handleViewReportDetail} scannedLocationData={scannedLocationData} isReturningFromDetail={isReturningFromDetail} />;
      case "staff-management":
        return userType === "admin" ? <StaffManagement /> : <Reports userType={userType} onViewReportDetail={handleViewReportDetail} scannedLocationData={scannedLocationData} isReturningFromDetail={isReturningFromDetail} />;
      case "toilet-management":
        return userType === "admin" ? <ToiletManagement /> : <Reports userType={userType} onViewReportDetail={handleViewReportDetail} scannedLocationData={scannedLocationData} isReturningFromDetail={isReturningFromDetail} />;
      case "zone-management":
        return userType === "admin" ? <ZoneManagement /> : <Reports userType={userType} onViewReportDetail={handleViewReportDetail} scannedLocationData={scannedLocationData} isReturningFromDetail={isReturningFromDetail} />;
      default:
        if (userType === "volunteer") {
          return <Scanner onScanComplete={handleScanComplete} />;
        } else if (userType === "admin") {
          return <Dashboard />;
        } else {
          return <Reports userType={userType} onViewReportDetail={handleViewReportDetail} scannedLocationData={scannedLocationData} loggedInUser={loggedInUser} isReturningFromDetail={isReturningFromDetail} />;
        }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pb-16 sm:pb-20 lg:pb-0">
              <Navigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          userType={userType} 
          onLogout={handleLogout}
          loggedInUser={loggedInUser}
        />
      <main className="lg:ml-64 p-3 sm:p-4 lg:p-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
