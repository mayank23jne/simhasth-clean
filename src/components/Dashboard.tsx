import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAudit } from "@/contexts/AuditContext";
import { useStaff } from "@/contexts/StaffContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Users,
  User,
  Building,
  QrCode,
  Calendar
} from "lucide-react";
import heroImage from "@/assets/hero-dashboard.jpg";


export function Dashboard() {
  const { auditReports, getRecentAudits } = useAudit();
  const { getActiveStaff } = useStaff();
  const { t } = useLanguage();
  const recentAudits = getRecentAudits(5);
  
  // Calculate comprehensive dashboard stats
  const totalAudits = auditReports.length;
  const completedAudits = auditReports.filter(audit => audit.status === 'completed').length;
  const issuesFound = auditReports.filter(audit => audit.status === 'issues-found').length;
  const activeStaff = new Set(auditReports.map(audit => audit.staffName)).size;
  
  // Calculate today's stats
  const today = new Date().toDateString();
  const todayAudits = auditReports.filter(audit => new Date(audit.timestamp).toDateString() === today);
  const todayCompleted = todayAudits.filter(audit => audit.status === 'completed').length;
  
  // Calculate staff performance
  const staffPerformance = Array.from(new Set(auditReports.map(audit => audit.staffName))).map(staffName => {
    const staffAudits = auditReports.filter(audit => audit.staffName === staffName);
    return {
      name: staffName,
      total: staffAudits.length,
      completed: staffAudits.filter(audit => audit.status === 'completed').length,
      issues: staffAudits.filter(audit => audit.status === 'issues-found').length
    };
  });
  

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} mins ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-hero shadow-elegant">
        <div className="absolute inset-0 bg-black/20" />
        <img 
          src={heroImage}
          alt="Admin Dashboard"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="relative p-4 sm:p-6 lg:p-8 text-white">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">{t('dashboard.title')}</h1>
          <p className="text-sm sm:text-lg lg:text-xl opacity-90">{t('dashboard.subtitle')}</p>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Live System</span>
            </div>
            <div className="text-sm">
              Today: {todayCompleted} tasks completed
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <Card className="bg-gradient-clean text-white shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4 lg:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">{completedAudits}</div>
            <p className="text-[10px] sm:text-xs opacity-80">Total completed</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4 lg:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">{t('dashboard.issuesFound')}</CardTitle>
            <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-destructive">{issuesFound}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4 lg:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Tasks</CardTitle>
            <Building className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">{totalAudits}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

      </div>

      {/* Staff Performance */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('dashboard.staffPerformanceOverview')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {staffPerformance.map((staff, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{staff.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {staff.total} tasks • {staff.completed} completed • {staff.issues} issues found
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-success text-success-foreground text-xs">
                    {Math.round((staff.completed / staff.total) * 100)}%
                  </Badge>
                </div>
              </div>
            ))}
            {staffPerformance.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No staff performance data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cleaning Frequency Overview */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Cleaning Frequency Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Hourly Cleaning */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-green-800">Hourly Cleaning</div>
                <Badge className="bg-green-600 text-white text-xs">High Priority</Badge>
              </div>
              <div className="text-2xl font-bold text-green-700 mb-1">12</div>
              <div className="text-xs text-green-600">Facilities requiring hourly maintenance</div>
              <div className="mt-2 text-xs text-green-700">
                • Central Park Restroom<br/>
                • Mahakal Temple Complex<br/>
                • Shipra Ghat Facilities
              </div>
            </div>

            {/* Daily Cleaning */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-blue-800">Daily Cleaning</div>
                <Badge className="bg-blue-600 text-white text-xs">Standard</Badge>
              </div>
              <div className="text-2xl font-bold text-blue-700 mb-1">8</div>
              <div className="text-xs text-blue-600">Facilities with daily schedules</div>
              <div className="mt-2 text-xs text-blue-700">
                • Accommodation Areas<br/>
                • Market Restrooms<br/>
                • Residential Periphery
              </div>
            </div>

            {/* Weekly Cleaning */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-orange-800">Weekly Cleaning</div>
                <Badge className="bg-orange-600 text-white text-xs">Low Priority</Badge>
              </div>
              <div className="text-2xl font-bold text-orange-700 mb-1">3</div>
              <div className="text-xs text-orange-600">Facilities with weekly maintenance</div>
              <div className="mt-2 text-xs text-orange-700">
                • Storage Areas<br/>
                • Equipment Rooms<br/>
                • Utility Spaces
              </div>
            </div>
          </div>

          {/* Frequency Summary */}
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Total Scheduled Cleanings Today:</span>
              <span className="font-bold text-primary">156 tasks</span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
              <span>Next scheduled cleaning in:</span>
              <span className="text-green-600 font-medium">23 minutes</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Audit Activity */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Task Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAudits.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No recent task activity</p>
              </div>
            ) : (
              recentAudits.map((audit) => (
                <div key={audit.id} className="flex items-start gap-3 p-4 rounded-lg border bg-card/50">
                  <div className={`p-2 rounded-full ${
                    audit.status === 'completed' ? 'bg-success/10' : 'bg-destructive/10'
                  }`}>
                    {audit.status === 'completed' ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium">{audit.facilityLocation}</div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {audit.cleaningType}
                        </Badge>
                        <div className="flex flex-col items-center">
                          <div className="p-1.5 rounded bg-blue-100">
                            <QrCode className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="text-[8px] text-blue-600 font-mono mt-0.5">
                            {audit.id}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Completed by {audit.staffName} • {formatTime(audit.timestamp)}
                    </div>
                    {audit.issues && (
                      <div className="text-xs text-destructive mt-2 p-2 bg-destructive/5 rounded">
                        Issues found: {audit.issues}
                      </div>
                    )}
                    {audit.notes && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Notes: {audit.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
