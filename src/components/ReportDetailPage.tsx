import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatTimestamp } from "@/lib/utils";
import { 
  ArrowLeft,
  MapPin, 
  User, 
  Clock,
  Image,
  MessageSquareWarning,
  Trash2,
  Droplets,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import { InteractiveMap, SimpleMap } from "./InteractiveMap";

const reportCategoriesBase = [
  { id: "overflowing-bin", key: "category.overflowingBin", icon: Trash2 },
  { id: "dirty-toilet", key: "category.dirtyToilet", icon: Droplets },
  { id: "garbage-pile", key: "category.garbagePile", icon: AlertTriangle },
  { id: "broken-facility", key: "category.brokenFacility", icon: AlertTriangle },
  { id: "other", key: "category.other", icon: MessageSquareWarning },
];

interface ReportDetailPageProps {
  report: any;
  onBack: () => void;
  onCompleteReport?: (reportId: string) => void;
}

export function ReportDetailPage({ report, onBack, onCompleteReport }: ReportDetailPageProps) {
  const { t } = useLanguage();
  
  // Get translated report categories
  const reportCategories = reportCategoriesBase.map(category => ({
    ...category,
    label: t(category.key)
  }));

  // Helper function to get category name from category ID
  const getCategoryName = (categoryId: string) => {
    const category = reportCategoriesBase.find(cat => cat.id === categoryId);
    return category ? t(category.key) : categoryId;
  };

  // Helper function to get translated report content
  const getTranslatedReportContent = (report: any) => {
    const translations: { [key: string]: { title: string; description: string } } = {
      'VR001': {
        title: t('report.overflowingGarbageBin'),
        description: t('report.overflowingDescription')
      },
      'VR002': {
        title: t('report.toiletRequiresCleaning'),
        description: t('report.toiletDescription')
      },
      'VR003': {
        title: t('report.unauthorizedGarbageDumping'),
        description: t('report.garbageDumpingDescription')
      },
      'VR004': {
        title: t('report.brokenWaterTap'),
        description: t('report.waterTapDescription')
      }
    };
    
    return translations[report.id] || { title: report.title, description: report.description };
  };

  const getTranslatedStatus = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'pending': t('status.pending'),
      'in-progress': t('status.inProgress'),
      'resolved': t('status.resolved'),
      'completed': t('status.completed')
    };
    return statusMap[status] || status;
  };

  const getTranslatedPriority = (priority: string) => {
    const priorityMap: { [key: string]: string } = {
      'high': t('priority.high'),
      'medium': t('priority.medium'),
      'low': t('priority.low')
    };
    return priorityMap[priority] || priority;
  };

  const getTranslatedReporter = (reporter: string) => {
    const reporterMap: { [key: string]: string } = {
      'Volunteer - Amit Singh': t('reporter.volunteerAmit'),
      'Staff - Priya Sharma': t('reporter.staffPriya'),
      'Public - Anonymous': t('reporter.publicAnonymous'),
      'Volunteer - Sunita Patel': t('reporter.volunteerSunita')
    };
    return reporterMap[reporter] || reporter;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-destructive text-destructive bg-destructive/10";
      case "medium": return "border-warning text-warning bg-warning/10";
      case "low": return "border-success text-success bg-success/10";
      default: return "border-muted text-muted-foreground bg-muted/10";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "border-success text-success bg-success/10";
      case "in-progress": return "border-warning text-warning bg-warning/10";
      case "pending": return "border-destructive text-destructive bg-destructive/10";
      default: return "border-muted text-muted-foreground bg-muted/10";
    }
  };

  const category = reportCategories.find(c => c.id === report.category);
  const Icon = category?.icon || MessageSquareWarning;

  return (
    <div className="space-y-6 p-3 sm:p-0">
      {/* Header with Back Button */}
      <div className="bg-gradient-subtle rounded-lg p-4 lg:p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon className="h-6 w-6 text-primary" />
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
              {t('reports.reportDetails')} - {report.id}
            </h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex-shrink-0"
          >
            {t('common.back')}
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Badge variant="outline" className={`${getPriorityColor(report.priority)} font-medium`}>
            {getTranslatedPriority(report.priority)} Priority
          </Badge>
          <Badge variant="outline" className={`${getStatusColor(report.status)} font-medium`}>
            {getTranslatedStatus(report.status)}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Overview */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquareWarning className="h-5 w-5" />
                Report Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-muted-foreground">{t('reports.category')}</h3>
                <p className="text-lg">{getCategoryName(report.category)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Photos Section */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                {t('reports.photos')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {report.photos && report.photos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report.photos.map((photo, index) => (
                    <div key={index} className="space-y-2">
                      <img 
                        src={photo}
                        alt={`Report photo ${index + 1}`}
                        className="w-full h-64 rounded-lg object-cover border cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(photo, '_blank')}
                      />
                      <p className="text-sm text-muted-foreground text-center">
                        Photo {index + 1} of {report.photos.length} - Click to enlarge
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 space-y-4 border-2 border-dashed border-muted rounded-lg">
                  <Image className="h-16 w-16 text-muted-foreground/50" />
                  <div className="text-center">
                    <p className="font-medium text-muted-foreground">{t('reports.noPhotos')}</p>
                    <p className="text-sm text-muted-foreground">{t('reports.noPhotosDescription')}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location & Map */}
          {report.gpsCoordinates && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location & Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-muted-foreground">Address</h3>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {report.location}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2 text-muted-foreground">GPS Coordinates</h3>
                    <p className="text-sm text-muted-foreground">
                      Latitude: {report.gpsCoordinates.lat.toFixed(6)}<br />
                      Longitude: {report.gpsCoordinates.lng.toFixed(6)}
                    </p>
                  </div>
                  
                  <div className="h-64">
                    <InteractiveMap
                      latitude={report.gpsCoordinates.lat}
                      longitude={report.gpsCoordinates.lng}
                      location={report.location}
                      className="h-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Report Details */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Report Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1 text-muted-foreground text-sm">Report ID</h3>
                <p className="font-mono text-sm">{report.id}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-1 text-muted-foreground text-sm">{t('common.reporter')}</h3>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{getTranslatedReporter(report.reporter)}</span>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-1 text-muted-foreground text-sm">{t('reports.timestamp')}</h3>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <div>{formatTimestamp(report.timestamp).date}</div>
                    <div className="text-xs text-muted-foreground">{formatTimestamp(report.timestamp).time}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-1 text-muted-foreground text-sm">Category</h3>
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm capitalize">{report.category.replace('-', ' ')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
