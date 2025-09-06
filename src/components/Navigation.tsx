import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useVolunteerReports } from "@/contexts/VolunteerReportsContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { 
  QrCode, 
  MessageSquareWarning,
  LogOut,
  User,
  BarChart3,
  Users,
  Building2,
  Map
} from "lucide-react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userType: "volunteer" | "staff" | "admin";
  onLogout: () => void;
  loggedInUser?: { username: string; name: string } | null;
}

export function Navigation({ activeTab, onTabChange, userType, onLogout, loggedInUser }: NavigationProps) {
  const { t } = useLanguage();
  const { volunteerReports } = useVolunteerReports();

  // Get count of assigned reports for staff
  const getAssignedReportsCount = () => {
    if (userType === "staff" && loggedInUser) {
      return volunteerReports.filter(report => 
        report.assignedStaffName === loggedInUser.name && 
        report.status === 'pending'
      ).length;
    }
    return 0;
  };

  const assignedReportsCount = getAssignedReportsCount();

  // Function to play bell sound when clicking notification
  const playNotificationBell = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Quick bell chime
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(500, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Audio not supported:', error);
    }
  };

  const navItems = userType === "staff" 
    ? [
        { id: "qr-audit", label: t('nav.qrAudit'), icon: QrCode },
        { id: "reports", label: t('nav.reportIssue'), icon: MessageSquareWarning },
      ]
    : userType === "admin"
    ? [
        { id: "dashboard", label: t('nav.dashboard'), icon: BarChart3 },
        { id: "volunteer-reports", label: t('nav.volunteerReports'), icon: MessageSquareWarning },
        { id: "staff-audits", label: "Staff Tasks", icon: User },
        { id: "staff-management", label: t('nav.staffManagement'), icon: Users },
        { id: "toilet-management", label: t('nav.facilityRegistry'), icon: Building2 },
        { id: "zone-management", label: "Zone Management", icon: Map },
      ]
    : [
        { id: "scanner", label: t('nav.scanner'), icon: QrCode },
        { id: "reports", label: t('nav.reportIssue'), icon: MessageSquareWarning },
      ];

  return (
    <>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border z-40 safe-area-pb">
        <style dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 374px) {
              .nav-text-normal { display: none !important; }
              .nav-text-ultra-short { display: inline !important; }
            }
            @media (min-width: 375px) {
              .nav-text-normal { display: inline !important; }
              .nav-text-ultra-short { display: none !important; }
            }
          `
        }} />
        <div className="flex justify-around py-1 px-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`flex-1 ${
                  activeTab === item.id ? "text-primary bg-primary/10" : "text-muted-foreground"
                }`}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '1px', 
                  minHeight: '45px', 
                  padding: '2px 1px',
                  minWidth: '0'
                }}
                onClick={() => {
                  if (userType === "staff" && item.id === "reports" && assignedReportsCount > 0) {
                    playNotificationBell();
                  }
                  onTabChange(item.id);
                }}
              >
                <div className="relative">
                  <Icon size={16} className="flex-shrink-0 w-4 h-4" />
                  {/* Show notification badge for staff reports */}
                  {userType === "staff" && item.id === "reports" && assignedReportsCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-[8px] bg-red-500 text-white rounded-full flex items-center justify-center animate-pulse">
                      {assignedReportsCount}
                    </Badge>
                  )}
                </div>
                <span className="text-[7px] leading-none text-center break-words max-w-full overflow-hidden whitespace-nowrap">
                  {/* Ultra-short labels for very small screens (≤374px) */}
                  <span className="nav-text-ultra-short">
                    {item.id === 'staff-management' ? 'Staff' : 
                     item.id === 'staff-audits' ? 'Tasks' : 
                     item.id === 'volunteer-reports' ? 'Vol' :
                     item.id === 'toilet-management' ? 'Toilet' :
                     item.id === 'zone-management' ? 'Zone' :
                     item.id === 'dashboard' ? 'Admin' :
                     item.id === 'qr-audit' ? 'QR' :
                     item.id === 'reports' ? 'Report' :
                     item.id === 'scanner' ? 'Scan' :
                     item.label.split(' ')[0]}
                  </span>
                  {/* Regular short labels for larger screens (≥375px) */}
                  <span className="nav-text-normal">
                    {item.id === 'staff-management' ? 'Staff' : 
                     item.id === 'staff-audits' ? 'Tasks' : 
                     item.id === 'volunteer-reports' ? 'Reports' :
                     item.id === 'toilet-management' ? 'Toilet' :
                     item.id === 'zone-management' ? 'Zone' :
                     item.id === 'dashboard' ? 'Admin' :
                     item.label.split(' ')[0]}
                  </span>
                </span>
              </Button>
            );
          })}
          {/* Logout button for mobile */}
          <Button
            variant="ghost"
            className="flex-1 text-muted-foreground"
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '1px', 
              minHeight: '45px', 
              padding: '2px 1px',
              minWidth: '0'
            }}
            onClick={onLogout}
          >
            <LogOut size={16} className="flex-shrink-0 w-4 h-4" />
            <span className="text-[7px] leading-none text-center whitespace-nowrap">
              Logout
            </span>
          </Button>
        </div>
      </nav>

      {/* Desktop Sidebar Navigation */}
      <nav className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-card border-r border-border">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md border border-blue-100">
              <img 
                src="/Simhastha logo.png" 
                alt="Simhastha Logo" 
                className="h-8 w-8 object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {t('app.title')}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t('app.subtitle')}
              </p>
            </div>
          </div>
          
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                <User className="h-3 w-3 mr-1" />
                {userType === "staff" ? "Staff Member" : 
                 userType === "admin" ? "Administrator" : "Volunteer"}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="h-8 px-2"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
            <LanguageSwitcher variant="select" />
          </div>
        </div>

        <div className="px-4 space-y-2">{navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={`w-full justify-start transition-smooth h-auto py-3 min-h-[44px] ${
                  activeTab === item.id ? "bg-gradient-primary text-primary-foreground shadow-elegant" : ""
                }`}
                onClick={() => {
                  if (userType === "staff" && item.id === "reports" && assignedReportsCount > 0) {
                    playNotificationBell();
                  }
                  onTabChange(item.id);
                }}
              >
                <div className="relative mr-3">
                  <Icon size={18} className="flex-shrink-0" />
                  {/* Show notification badge for staff reports */}
                  {userType === "staff" && item.id === "reports" && assignedReportsCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-[8px] bg-red-500 text-white rounded-full flex items-center justify-center animate-pulse">
                      {assignedReportsCount}
                    </Badge>
                  )}
                </div>
                <span className="text-left leading-tight text-xs break-words overflow-hidden max-w-[180px] hyphens-auto">
                  {item.id === 'staff-management' ? 'Staff Sanitation Mgmt' : item.label}
                </span>
              </Button>
            );
          })}
        </div>
      </nav>

    </>
  );
}