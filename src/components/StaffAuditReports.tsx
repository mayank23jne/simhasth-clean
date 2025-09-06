import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAudit } from "@/contexts/AuditContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { AuditPhotosDialog } from "@/components/AuditPhotosDialog";
import { toast } from "sonner";
import { 
  Users, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle,
  Search,
  Filter,
  Calendar,
  User,
  Building,
  ClipboardCheck,
  Image,
  Eye
} from "lucide-react";

export function StaffTaskReports() {
  const { auditReports, getRecentAudits } = useAudit();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStaff, setFilterStaff] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [previousCount, setPreviousCount] = useState(auditReports.length);
  const [selectedAuditPhotos, setSelectedAuditPhotos] = useState<{
    photos: string[];
    auditId: string;
    facilityLocation: string;
  } | null>(null);
  const [isPhotosDialogOpen, setIsPhotosDialogOpen] = useState(false);

  // Monitor for new audit reports
  useEffect(() => {
    if (auditReports.length > previousCount) {
      const newAudit = auditReports[0]; // Most recent audit
      toast.success(`${t('staffAudit.newAuditReceived')} ${newAudit.staffName} ${t('staffAudit.at')} ${newAudit.facilityLocation}!`);
    }
    setPreviousCount(auditReports.length);
  }, [auditReports.length, previousCount]);

  // Get unique staff members
  const staffMembers = Array.from(new Set(auditReports.map(report => report.staffName)));

  // Handle viewing audit photos
  const handleViewPhotos = (report: any) => {
    setSelectedAuditPhotos({
      photos: report.photos || [],
      auditId: report.id,
      facilityLocation: report.facilityLocation
    });
    setIsPhotosDialogOpen(true);
  };

  const handleClosePhotosDialog = () => {
    setIsPhotosDialogOpen(false);
    setSelectedAuditPhotos(null);
  };

  // Filter reports based on search and filters
  const filteredReports = auditReports.filter(report => {
    const matchesSearch = 
      report.facilityLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.facilityId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStaff = filterStaff === "all" || report.staffName === filterStaff;
    const matchesStatus = filterStatus === "all" || report.status === filterStatus;

    return matchesSearch && matchesStaff && matchesStatus;
  });

  // Get staff statistics
  const getStaffStats = () => {
    const stats = staffMembers.map(staffName => {
      const staffReports = auditReports.filter(report => report.staffName === staffName);
      const completedCount = staffReports.filter(report => report.status === 'completed').length;
      const issuesCount = staffReports.filter(report => report.status === 'issues-found').length;
      
      return {
        name: staffName,
        total: staffReports.length,
        completed: completedCount,
        issues: issuesCount,
        lastAudit: staffReports[0]?.timestamp
      };
    });
    
    return stats.sort((a, b) => b.total - a.total);
  };

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

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-subtle rounded-lg p-4 lg:p-6 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl lg:text-3xl font-bold">Staff Task Reports</h1>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">{t('staffAudit.live')}</span>
          </div>
        </div>
        <p className="text-muted-foreground text-sm lg:text-base">
          Real-time monitoring of staff task completion • Total Reports: {auditReports.length}
        </p>
      </div>



      {/* Filters */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Task Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('staffAudit.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterStaff} onValueChange={setFilterStaff}>
              <SelectTrigger>
                <SelectValue placeholder={t('staffAudit.filterByStaff')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('staffAudit.allStaff')}</SelectItem>
                {staffMembers.map(staff => (
                  <SelectItem key={staff} value={staff}>{staff}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder={t('staffAudit.filterByStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('staffAudit.allStatus')}</SelectItem>
                <SelectItem value="completed">{t('status.completed')}</SelectItem>
                <SelectItem value="issues-found">{t('staffAudit.issuesFound')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Reports List */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            Recent Task Reports ({filteredReports.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ClipboardCheck className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>{t('staffAudit.noReports')}</p>
              </div>
            ) : (
              filteredReports.map((report) => (
                <Card key={report.id} className="border-l-4 border-l-primary bg-card/50">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                      {/* Report Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{report.facilityLocation}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {t('staffAudit.facilityId')}: {report.facilityId}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {t('staffAudit.staff')}: {report.staffName}
                          </span>
                        </div>
                      </div>

                      {/* Audit Details */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {report.cleaningType.toUpperCase()}
                          </Badge>
                          <Badge 
                            className={
                              report.status === 'completed' 
                                ? "bg-success text-success-foreground" 
                                : "bg-destructive text-destructive-foreground"
                            }
                          >
                            {report.status === 'completed' ? (
                              <>
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                {t('status.completed')}
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                {t('staffAudit.issuesFound')}
                              </>
                            )}
                          </Badge>
                        </div>
                        
                        {report.issues && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">{t('staffAudit.issues')}:</p>
                            <p className="text-sm">{report.issues}</p>
                          </div>
                        )}
                        
                        {report.notes && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">{t('staffAudit.notes')}:</p>
                            <p className="text-sm">{report.notes}</p>
                          </div>
                        )}
                      </div>

                      {/* Photos Column */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Image className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-sm">{t('staffAudit.photos')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {report.photos && report.photos.length > 0 ? (
                            <>
                              <Badge variant="outline" className="text-xs">
                                {report.photos.length} {t('staffAudit.photosCount')}
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewPhotos(report)}
                                className="h-7 px-2 text-xs"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                {t('staffAudit.viewPhotos')}
                              </Button>
                            </>
                          ) : (
                            <Badge variant="outline" className="text-xs text-muted-foreground">
                              {t('staffAudit.noPhotos')}
                            </Badge>
                          )}
                        </div>
                        {report.photos && report.photos.length > 0 ? (
                          <div className="flex gap-1">
                            {report.photos.slice(0, 3).map((photo: string, index: number) => (
                              <img
                                key={index}
                                src={photo}
                                alt={`${t('staffAudit.auditPhoto')} ${index + 1}`}
                                className="w-8 h-8 object-cover rounded border cursor-pointer hover:scale-110 transition-transform"
                                onClick={() => handleViewPhotos(report)}
                              />
                            ))}
                            {report.photos.length > 3 && (
                              <div className="w-8 h-8 bg-muted rounded border flex items-center justify-center text-xs text-muted-foreground cursor-pointer hover:bg-muted/80"
                                   onClick={() => handleViewPhotos(report)}>
                                +{report.photos.length - 3}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs text-muted-foreground">
                            No photos
                          </div>
                        )}
                      </div>

                      {/* Timestamp */}
                      <div className="flex flex-col justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDateTime(report.timestamp)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                          <Clock className="h-3 w-3" />
                          <span>{formatTime(report.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Audit Photos Dialog */}
      {selectedAuditPhotos && (
        <AuditPhotosDialog
          isOpen={isPhotosDialogOpen}
          onClose={handleClosePhotosDialog}
          photos={selectedAuditPhotos.photos}
          auditId={selectedAuditPhotos.auditId}
          facilityLocation={selectedAuditPhotos.facilityLocation}
        />
      )}
    </div>
  );
}
