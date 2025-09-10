import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useVolunteerReports } from "@/contexts/VolunteerReportsContext";
import { useAudit } from "@/contexts/AuditContext";
import { useStaff } from "@/contexts/StaffContext";
import { useZone } from "@/contexts/ZoneContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { PhotoCapture } from "@/components/PhotoCapture";
import { Scanner } from "@/components/Scanner";
import { formatTimestamp } from "@/lib/utils";
import { toast } from "sonner";
import { 
  MessageSquareWarning, 
  Camera, 
  MapPin, 
  Send,
  Trash2,
  Droplets,
  AlertTriangle,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Eye,
  Image,
  QrCode,
  CheckCircle2,
  Bell,
  BellRing,
  X
} from "lucide-react";
import volunteerImage from "@/assets/volunteer-report.jpg";
import MapView from "./MapView";

const reportCategoriesBase = [
  { id: "overflowing-bin", key: "category.overflowingBin", icon: Trash2 },
  { id: "dirty-toilet", key: "category.dirtyToilet", icon: Droplets },
  { id: "garbage-pile", key: "category.garbagePile", icon: AlertTriangle },
  { id: "broken-facility", key: "category.brokenFacility", icon: AlertTriangle },
  { id: "other", key: "category.other", icon: MessageSquareWarning },
];

const volunteerReports = [
  {
    id: "R001",
    category: "overflowing-bin",
    location: "Park Avenue - Block C, Simhastha Grounds, Ujjain (22.719654, 75.857832)",
    coordinates: { lat: 22.719654, lng: 75.857832 },
    gpsCoordinates: { lat: 22.719654, lng: 75.857832 },
    status: "pending",
    priority: "medium",
    reporter: "Volunteer - Amit Singh",
    time: "15 mins ago",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    description: "Report submitted via mobile app",
    image: volunteerImage,
    photos: [volunteerImage]
  },
  {
    id: "R002", 
    category: "dirty-toilet",
    location: "Main Market - Platform 1, Simhastha Grounds, Ujjain (22.715623, 75.857245)",
    coordinates: { lat: 22.715623, lng: 75.857245 },
    gpsCoordinates: { lat: 22.715623, lng: 75.857245 },
    status: "in-progress",
    priority: "medium",
    reporter: "Volunteer - Priya Sharma",
    time: "32 mins ago",
    timestamp: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
    description: "Report submitted via mobile app",
    image: volunteerImage,
    photos: [volunteerImage]
  },
  {
    id: "R003",
    category: "overflowing-bin",
    location: "Bus Station - Platform 2, Simhastha Grounds, Ujjain (22.716891, 75.856734)",
    coordinates: { lat: 22.716891, lng: 75.856734 },
    gpsCoordinates: { lat: 22.716891, lng: 75.856734 },
    status: "resolved",
    priority: "medium",
    reporter: "Volunteer - Rajesh Kumar",
    time: "1 hour ago",
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    description: "Report submitted via mobile app",
    image: volunteerImage,
    photos: [volunteerImage]
  },
  {
    id: "R004",
    category: "dirty-toilet",
    location: "Community Center - Hall A, Simhastha Grounds, Ujjain (22.718456, 75.858912)",
    coordinates: { lat: 22.718456, lng: 75.858912 },
    gpsCoordinates: { lat: 22.718456, lng: 75.858912 },
    status: "pending",
    priority: "medium",
    reporter: "Volunteer - Sunita Devi",
    time: "2 hours ago",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    description: "Report submitted via mobile app",
    image: volunteerImage,
    photos: [volunteerImage]
  }
];

const recentReports = [
  {
    id: "R001",
    category: "overflowing-bin",
    location: "Park Avenue - Block C, Simhastha Grounds, Ujjain (22.719654, 75.857832)",
    status: "pending",
    priority: "medium",
    reporter: "Volunteer - Amit Singh",
    time: "15 mins ago",
    description: "Report submitted via mobile app"
  },
  {
    id: "R002", 
    category: "dirty-toilet",
    location: "Main Market - Platform 1, Simhastha Grounds, Ujjain (22.715623, 75.857245)",
    status: "in-progress",
    priority: "medium",
    reporter: "Volunteer - Priya Sharma",
    time: "32 mins ago",
    description: "Report submitted via mobile app"
  },
  {
    id: "R003",
    category: "overflowing-bin",
    location: "Bus Station - Platform 2, Simhastha Grounds, Ujjain (22.716891, 75.856734)",
    status: "resolved",
    priority: "medium",
    reporter: "Volunteer - Rajesh Kumar",
    time: "1 hour ago",
    description: "Report submitted via mobile app"
  }
];

interface ReportsProps {
  userType?: "volunteer" | "staff" | "admin";
  onViewReportDetail?: (report: any) => void;
  scannedLocationData?: { location: string; coordinates: { lat: number; lng: number } } | null;
  loggedInUser?: { username: string; name: string } | null;
  isReturningFromDetail?: boolean;
}

// Report Detail Dialog Component
const ReportDetailDialog = ({ report }: { report: any }) => {
  const { t } = useLanguage();
  const reportCategories = reportCategoriesBase.map(category => ({
    ...category,
    label: t(category.key)
  }));

  // Helper function to get category name from category ID
  const getCategoryName = (categoryId: string) => {
    const category = reportCategoriesBase.find(cat => cat.id === categoryId);
    return category ? t(category.key) : categoryId;
  };
  
  const getTranslatedReportContent = (report: any) => {
    // Since we simplified the form, all reports now have standard descriptions
    return { 
      title: getCategoryName(report.category), 
      description: report.description || "Report submitted via mobile app"
    };
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
      case "high": return "border-destructive text-destructive";
      case "medium": return "border-warning text-warning";
      case "low": return "border-success text-success";
      default: return "border-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "border-success text-success";
      case "in-progress": return "border-warning text-warning";
      case "pending": return "border-destructive text-destructive";
      default: return "border-muted text-muted-foreground";
    }
  };

  const category = reportCategories.find(c => c.id === report.category);
  const Icon = category?.icon || MessageSquareWarning;

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5" />
          {t('reports.reportDetails')} - {report.id}
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Report Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">{t('reports.category')}</h3>
              <p className="text-sm">{getCategoryName(report.category)}</p>
            </div>
            
            
            <div>
              <h3 className="font-semibold mb-2">{t('reports.location')}</h3>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{report.location}</span>
              </div>
              {report.gpsCoordinates && (
                <div className="text-xs text-muted-foreground mt-1">
                  GPS: {report.gpsCoordinates.lat.toFixed(6)}, {report.gpsCoordinates.lng.toFixed(6)}
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">{t('common.reporter')}</h3>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{getTranslatedReporter(report.reporter)}</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">{t('reports.timestamp')}</h3>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <div>{formatTimestamp(report.timestamp).date}</div>
                  <div className="text-xs text-muted-foreground">{formatTimestamp(report.timestamp).time}</div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div>
                <h3 className="font-semibold mb-2">{t('reports.priority')}</h3>
                <Badge variant="outline" className={getPriorityColor(report.priority)}>
                  {getTranslatedPriority(report.priority)}
                </Badge>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">{t('common.status')}</h3>
                <Badge variant="outline" className={getStatusColor(report.status)}>
                  {getTranslatedStatus(report.status)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        {/* Photos Section */}
        <div>
          <h3 className="font-semibold mb-4">{t('reports.photos')}</h3>
          {report.photos && report.photos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {report.photos.map((photo, index) => (
                <div key={index} className="space-y-2">
                  <img 
                    src={photo}
                    alt={`Report photo ${index + 1}`}
                    className="w-full h-48 rounded-lg object-cover border"
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    Photo {index + 1} of {report.photos.length}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 space-y-4 border-2 border-dashed border-muted rounded-lg">
              <Image className="h-12 w-12 text-muted-foreground/50" />
              <div className="text-center">
                <p className="font-medium text-muted-foreground">{t('reports.noPhotos')}</p>
                <p className="text-sm text-muted-foreground">{t('reports.noPhotosDescription')}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Map Section (if GPS coordinates available) */}
        {report.gpsCoordinates && (
          <div>
            <h3 className="font-semibold mb-4">{t('reports.location')}</h3>
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Map view would be displayed here</p>
                <p className="text-xs text-muted-foreground">
                  Coordinates: {report.gpsCoordinates.lat.toFixed(6)}, {report.gpsCoordinates.lng.toFixed(6)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DialogContent>
  );
};

export function Reports({ userType = "volunteer", onViewReportDetail, scannedLocationData, loggedInUser, isReturningFromDetail = false }: ReportsProps) {
  const { volunteerReports, addVolunteerReport, updateReportStatus, getReportsByStatus } = useVolunteerReports();
  const { addAuditReport } = useAudit();
  const { getActiveStaff, getAvailableStaffInZone } = useStaff();
  const { getZoneByCoordinates } = useZone();
  const { t } = useLanguage();
  
  const [showTaskAlert, setShowTaskAlert] = useState(false);
  const [taskAlertCount, setTaskAlertCount] = useState(0);
  
  // Use localStorage to persist alert state across component mounts/unmounts
  const getAlertKey = () => `hasShownAlert_${loggedInUser?.username || 'unknown'}`;
  const [hasShownInitialAlert, setHasShownInitialAlert] = useState(() => {
    if (typeof window !== 'undefined' && loggedInUser) {
      return localStorage.getItem(getAlertKey()) === 'true';
    }
    return false;
  });
  
  // Clear alert state for testing (can be removed in production)
  const clearAlertState = () => {
    if (loggedInUser) {
      localStorage.removeItem(getAlertKey());
      setHasShownInitialAlert(false);
    }
  };
  
  // Function to play bell sound
  const playBellSound = () => {
    try {
      // Create a simple bell sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Bell-like sound frequencies
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
    } catch (error) {
      console.log('Audio not supported:', error);
    }
  };

  // Function to play success sound when all tasks completed
  const playSuccessSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Play a cheerful success melody
      const frequencies = [523, 659, 784, 1047]; // C, E, G, C (major chord)
      
      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime + index * 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.1 + 0.5);
        
        oscillator.start(audioContext.currentTime + index * 0.1);
        oscillator.stop(audioContext.currentTime + index * 0.1 + 0.5);
      });
    } catch (error) {
      console.log('Audio not supported:', error);
    }
  };
  
  // Show notification for staff when they have assigned reports
  useEffect(() => {
    if (userType === "staff" && loggedInUser) {
      const myReports = volunteerReports.filter(report => 
        report.assignedStaffName === loggedInUser.name && 
        report.status === 'pending'
      );
      
      const currentPendingCount = myReports.length;
      const alertKey = getAlertKey();
      const hasShownBefore = localStorage.getItem(alertKey) === 'true';
      
      // Only show initial welcome alert if we haven't shown it before for this user
      if (currentPendingCount > 0 && !hasShownBefore) {
        setTaskAlertCount(currentPendingCount);
        setShowTaskAlert(true);
        setHasShownInitialAlert(true);
        localStorage.setItem(alertKey, 'true');
        
        // Only play bell sound if not returning from detail view
        if (!isReturningFromDetail) {
          playBellSound();
        }
        
        // Also show toast
        toast.success(`Welcome ${loggedInUser.name}! You have ${currentPendingCount} task${currentPendingCount > 1 ? 's' : ''} assigned to you.`, {
          duration: 4000,
        });
      }
      // If task count decreased (task completed), hide alert and show completion message
      else if (currentPendingCount < taskAlertCount && taskAlertCount > 0 && hasShownBefore) {
        setTaskAlertCount(currentPendingCount);
        
        // Hide alert if no more pending tasks
        if (currentPendingCount === 0) {
          setShowTaskAlert(false);
          playSuccessSound();
          toast.success(`🎉 Excellent work! All tasks completed successfully!`, {
            duration: 5000,
          });
        } else {
          // Update alert count but keep it visible
          toast.success(`✅ Task completed! ${currentPendingCount} task${currentPendingCount > 1 ? 's' : ''} remaining.`, {
            duration: 3000,
          });
        }
      }
      // Update count if tasks increased (new assignments) - only if we've shown initial alert
      else if (currentPendingCount > taskAlertCount && hasShownBefore) {
        const newTasks = currentPendingCount - taskAlertCount;
        setTaskAlertCount(currentPendingCount);
        setShowTaskAlert(true);
        
        // Only play bell sound if not returning from detail view
        if (!isReturningFromDetail) {
          playBellSound();
        }
        
        toast.info(`🔔 ${newTasks} new task${newTasks > 1 ? 's' : ''} assigned to you!`, {
          duration: 4000,
        });
      }
      // Just update the count silently for navigation or initial load
      else {
        setTaskAlertCount(currentPendingCount);
      }
    }
  }, [userType, loggedInUser, volunteerReports, taskAlertCount, isReturningFromDetail]);
  
  // Get translated report categories - limit to 2 for volunteers
    const reportCategories = userType === "volunteer"
    ? reportCategoriesBase.filter(category =>
        category.id === "overflowing-bin" || category.id === "dirty-toilet"
      ).map(category => ({
        ...category,
        label: t(category.key)
      }))
    : reportCategoriesBase.map(category => ({
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
    // Since we simplified the form, all reports now have standard descriptions
    return { 
      title: getCategoryName(report.category), 
      description: report.description || "Report submitted via mobile app"
    };
  };

  // Helper function to translate status
  const getTranslatedStatus = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'pending': t('status.pending'),
      'in-progress': t('status.inProgress'),
      'resolved': t('status.resolved'),
      'completed': t('status.completed')
    };
    return statusMap[status] || status;
  };

  // Helper function to translate priority
  const getTranslatedPriority = (priority: string) => {
    const priorityMap: { [key: string]: string } = {
      'high': t('priority.high'),
      'medium': t('priority.medium'),
      'low': t('priority.low')
    };
    return priorityMap[priority] || priority;
  };

  const getTranslatedReporter = (reporter: string) => {
    // Extract type and name from "Type - Name" format
    const [type, name] = reporter.split(' - ');
    
    const typeMap: { [key: string]: string } = {
      'Volunteer': t('reporterType.volunteer'),
      'Staff': t('reporterType.staff'),
      'Public': t('reporterType.public')
    };
    
    const nameMap: { [key: string]: string } = {
      'Amit Singh': t('reporter.amitSingh'),
      'Priya Sharma': t('reporter.priyaSharma'),
      'Rajesh Kumar': t('reporter.rajeshKumar'),
      'Sunita Devi': t('reporter.sunitaDevi'),
      'Anonymous': t('reporter.anonymous')
    };
    
    const translatedType = typeMap[type] || type;
    const translatedName = nameMap[name] || name;
    
    return `${translatedType} - ${translatedName}`;
  };
  
  const [selectedCategory, setSelectedCategory] = useState("");
  const [reportData, setReportData] = useState({
    title: "",
    description: "",
    location: "",
    priority: "medium"
  });
  const [gpsCoordinates, setGpsCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const [selectedReportForCompletion, setSelectedReportForCompletion] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isPhotoCaptureOpen, setIsPhotoCaptureOpen] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);

  // Auto-fill location from scanned QR data
  useEffect(() => {
    if (scannedLocationData && userType === "volunteer") {
      setReportData(prev => ({
        ...prev,
        location: scannedLocationData.location
      }));
      setGpsCoordinates(scannedLocationData.coordinates);
      toast.success("Location auto-filled from QR scan!");
    }
  }, [scannedLocationData, userType]);


  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setGpsCoordinates({ lat: latitude, lng: longitude });
          setReportData({
            ...reportData, 
            location: `GPS: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to get your location. Please enable GPS and try again.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmitReport = () => {
    if (!selectedCategory || !reportData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    // Auto-generate title based on category for volunteers
    const autoTitle = userType === "volunteer" 
      ? (selectedCategory === "overflowing-bin" 
          ? t('report.overflowingGarbageBin')
          : t('report.toiletRequiresCleaning'))
      : reportData.title;

    // Simulate API call
    setTimeout(() => {
      // Add volunteer report to context
      addVolunteerReport({
        category: selectedCategory,
        title: autoTitle,
        description: reportData.description || "Report submitted via mobile app",
        location: reportData.location,
        priority: userType === "volunteer" ? 'medium' : reportData.priority as 'low' | 'medium' | 'high',
        reporter: userType === "volunteer" && loggedInUser ? loggedInUser.name : `${userType} - User`,
        gpsCoordinates,
        photos: capturedPhotos.length > 0 ? capturedPhotos : undefined
      }, getZoneByCoordinates, getAvailableStaffInZone);

      toast.success(t('message.reportSubmitted'));
      
      // Reset form
      setReportData({ title: "", description: "", location: "", priority: "medium" });
      setSelectedCategory("");
      setGpsCoordinates(null);
      setCapturedPhotos([]);
      setIsSubmitting(false);
    }, 1500);
  };

  const handlePhotosCapture = (photos: string[]) => {
    setCapturedPhotos(photos);
    toast.success(`${photos.length} ${t('photo.capturedPhotos')} ${t('common.saved')}`);
  };

  const handleOpenPhotoCapture = () => {
    console.log('Opening photo capture dialog...');
    setIsPhotoCaptureOpen(true);
  };

  const handleClosePhotoCapture = () => {
    console.log('Closing photo capture dialog...');
    setIsPhotoCaptureOpen(false);
  };

  const handleCompleteReport = (reportId: string) => {
    setSelectedReportForCompletion(reportId);
    setIsQRDialogOpen(true);
  };

  const handleQRScanComplete = () => {
    console.log('QR scan completed for report:', selectedReportForCompletion);
    
    if (selectedReportForCompletion) {
      const report = volunteerReports.find(r => r.id === selectedReportForCompletion);
      if (report) {
        // Add to audit reports
        addAuditReport({
          facilityId: `F${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
          facilityLocation: report.location,
          staffId: 'current-staff', // This would be the logged-in staff ID
          staffName: 'Current Staff Member', // This would be the logged-in staff name
          cleaningType: 'issue-resolution',
          issues: '',
          notes: `Resolved volunteer report: ${report.title}`,
          qrCode: `QR${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          status: 'completed'
        });

        // Update report status to resolved
        updateReportStatus(selectedReportForCompletion, 'resolved');
        
        toast.success(`Report ${report.id} marked as resolved!`);
      }
    }
    
    setIsQRDialogOpen(false);
    setSelectedReportForCompletion(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "text-warning";
      case "in-progress": return "text-primary";
      case "resolved": return "text-success";
      default: return "text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-destructive";
      case "medium": return "text-warning";
      case "low": return "text-muted-foreground";
      default: return "text-muted-foreground";
    }
  };

  // Admin View - Table format for better visibility
  if (userType === "admin") {
    const pendingReports = getReportsByStatus("pending").concat(getReportsByStatus("in-progress"));
    const completedReports = getReportsByStatus("resolved");

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Volunteer Reports
            </h1>
            <p className="text-muted-foreground">Monitor and manage all community-submitted reports</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-sm bg-warning/10 text-warning border-warning/20">
              {pendingReports.length} {t('count.pending')}
            </Badge>
            <Badge variant="outline" className="text-sm bg-success/10 text-success border-success/20">
              {completedReports.length} {t('count.completed')}
            </Badge>
          </div>
        </div>

        {/* Reports Table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareWarning className="h-5 w-5" />
              All Volunteer Reports ({volunteerReports.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">{t('common.id')}</TableHead>
                    <TableHead>{t('reports.category')}</TableHead>
                    <TableHead>{t('reports.location')}</TableHead>
                    <TableHead>{t('common.reporter')}</TableHead>
                    <TableHead>Assigned Staff</TableHead>
                    <TableHead>{t('reports.priority')}</TableHead>
                    <TableHead>{t('common.status')}</TableHead>
                    <TableHead>{t('common.photo')}</TableHead>
                    <TableHead>{t('common.dateTime')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {volunteerReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2">
                          <MessageSquareWarning className="h-12 w-12 text-muted-foreground/50" />
                          <p className="text-muted-foreground font-medium">No volunteer reports found</p>
                          <p className="text-sm text-muted-foreground">Reports submitted by volunteers will appear here</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    volunteerReports.map((report) => {
                      const category = reportCategories.find(c => c.id === report.category);
                      const Icon = category?.icon || MessageSquareWarning;
                      
                      return (
                        <TableRow key={report.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className="p-1 rounded-full bg-primary/10">
                                <Icon className="h-3 w-3 text-primary" />
                              </div>
                              <span className="text-sm">{report.id}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[250px]">
                              <div className="font-medium text-sm truncate">{getCategoryName(report.category)}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[180px]">
                              <div className="flex items-center gap-1 text-sm">
                                <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                <span className="truncate">{report.location}</span>
                              </div>
                              {report.gpsCoordinates && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  GPS: {report.gpsCoordinates.lat.toFixed(4)}, {report.gpsCoordinates.lng.toFixed(4)}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm max-w-[120px] truncate">
                              {getTranslatedReporter(report.reporter).replace(/^[^-]+ - /, '')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm max-w-[120px]">
                              {report.assignedStaffName ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="truncate">{report.assignedStaffName}</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                  <span className="text-xs">Auto-assigning...</span>
                                </div>
                              )}
                              {report.assignedZone && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  Zone: {report.assignedZone}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={`${getPriorityColor(report.priority)} text-xs`}
                            >
                              {getTranslatedPriority(report.priority)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={`${getStatusColor(report.status)} text-xs`}
                            >
                              {getTranslatedStatus(report.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 px-2 text-xs"
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  {t('action.view')}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4">
                                <DialogHeader>
                                  <DialogTitle className="text-lg">Photos for Report {report.id}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  {report.photos && report.photos.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {report.photos.map((photo, index) => (
                                        <div key={index} className="space-y-2">
                                          <img 
                                            src={photo}
                                            alt={`Report photo ${index + 1} for ${report.title}`}
                                            className="w-full h-auto rounded-lg object-contain border"
                                          />
                                          <p className="text-sm text-muted-foreground text-center">
                                            Photo {index + 1} of {report.photos.length}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                      <Image className="h-16 w-16 text-muted-foreground/50" />
                                      <div className="text-center">
                                        <p className="font-medium text-muted-foreground">No photos available</p>
                                        <p className="text-sm text-muted-foreground">
                                          This report was submitted without photos
                                        </p>
                                      </div>
                                      <img 
                                        src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center" 
                                        alt="Default report illustration"
                                        className="w-64 h-48 rounded-lg object-cover opacity-50"
                                      />
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{formatTimestamp(report.timestamp).date}</div>
                              <div className="text-xs text-muted-foreground">
                                {formatTimestamp(report.timestamp).time}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Staff view - Show list of volunteer reports assigned to logged-in staff
  if (userType === "staff") {
    // Filter reports assigned to the logged-in staff member
    const myReports = loggedInUser 
      ? volunteerReports.filter(report => report.assignedStaffName === loggedInUser.name)
      : [];


    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-subtle rounded-lg p-4 lg:p-6 shadow-card border-l-4 border-l-primary">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <MessageSquareWarning className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">
                My Assigned Tasks {loggedInUser && `- ${loggedInUser.name}`}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Tasks require your attention
              </p>
            </div>
          </div>
          <p className="text-muted-foreground text-sm lg:text-base">
            Reports assigned to you based on your zone coverage • Complete tasks to help maintain cleanliness
          </p>
        </div>

        {/* Task Alert Notification */}
        {showTaskAlert && (
          <Alert className={`shadow-md transition-all duration-300 ${
            taskAlertCount === 0 
              ? "border-green-200 bg-green-50" 
              : "border-orange-200 bg-orange-50"
          }`}>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <AlertTitle className={`text-sm font-semibold ${
                  taskAlertCount === 0 ? "text-green-800" : "text-orange-800"
                }`}>
                  {taskAlertCount === 0 ? "🎉 All Done!" : `🔔 ${taskAlertCount} Task${taskAlertCount > 1 ? 's' : ''} Pending`}
                </AlertTitle>
                <AlertDescription className={`text-xs ${taskAlertCount === 0 ? "text-green-600" : "text-orange-600"}`}>
                  {taskAlertCount === 0 ? (
                    "Great work! All tasks completed."
                  ) : (
                    "Complete these tasks to maintain zone cleanliness."
                  )}
                </AlertDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTaskAlert(false)}
                className={`h-8 w-8 p-0 ${taskAlertCount === 0 
                  ? "text-green-600 hover:bg-green-100"
                  : "text-orange-600 hover:bg-orange-100"
                }`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Alert>
        )}

        {/* Reports Cards */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareWarning className="h-5 w-5" />
              My Assigned Reports ({myReports.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                  {myReports.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquareWarning className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                          <p className="text-muted-foreground font-medium">No reports assigned to you</p>
                          <p className="text-sm text-muted-foreground">Reports in your assigned zones will appear here when volunteers submit them</p>
                        </div>
                      ) : (
                        myReports.map((report) => {
                      const category = reportCategories.find(c => c.id === report.category);
                      const Icon = category?.icon || MessageSquareWarning;
                      
                                        return (
                    <Card 
                      key={report.id} 
                      className="border-l-4 border-l-primary bg-card/50 hover:bg-card/80 transition-colors cursor-pointer"
                      onClick={() => onViewReportDetail?.(report)}
                    >
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                          {/* Report Info */}
                          <div className="lg:col-span-2 space-y-2">
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-full bg-primary/10 flex-shrink-0">
                                <Icon className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-sm truncate">{getCategoryName(report.category)}</h3>
                                  <Badge variant="outline" className="text-xs">
                                    {report.id}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Location & Reporter */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm truncate">{report.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm truncate">
                                {getTranslatedReporter(report.reporter).replace(/^[^-]+ - /, '')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                              <div className="text-sm text-muted-foreground">
                                <div>{formatTimestamp(report.timestamp).date}</div>
                                <div className="text-xs">{formatTimestamp(report.timestamp).time}</div>
                              </div>
                            </div>
                          </div>

                          {/* Status & Actions */}
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-wrap gap-2">
                              <Badge 
                                variant="outline" 
                                className={`${getPriorityColor(report.priority)} text-xs`}
                              >
                                {getTranslatedPriority(report.priority)}
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className={`${getStatusColor(report.status)} text-xs`}
                              >
                                {getTranslatedStatus(report.status)}
                              </Badge>
                            </div>
                            
                            <div className="flex gap-2 mt-2">
                              {report.status === 'resolved' ? (
                                <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20 h-8 px-2 flex items-center">
                                  {t('action.completed')}
                                </Badge>
                              ) : (
                                <Button
                                  size="sm"
                                  className="h-8 px-3 text-xs bg-success hover:bg-success/90"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCompleteReport(report.id);
                                  }}
                                >
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  {t('staff.complete')}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                    })
                  )}
            </div>
          </CardContent>
        </Card>

        {/* QR Scanner Dialog */}
        <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Complete Report - Scan QR Code
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                {selectedReportForCompletion && (
                  <p>Completing report: <strong>{selectedReportForCompletion}</strong></p>
                )}
                <p>Scan the QR code at the facility to mark this report as resolved.</p>
              </div>
              
              {/* Scanner Component */}
              <div className="border rounded-lg p-4">
                <Scanner onScanComplete={handleQRScanComplete} />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsQRDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Volunteer view - Report submission form
  return (
          <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-gradient-subtle rounded-lg p-3 sm:p-4 lg:p-6 shadow-card">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">{t('reports.title')}</h1>
          <p className="text-muted-foreground text-xs sm:text-sm lg:text-base">
            {t('reports.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Report Creation Form */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareWarning className="h-5 w-5" />
              {t('reports.submitReport')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              {/* <img 
                src={volunteerImage}
                alt="Volunteer Reporting"
                className="w-full h-32 object-cover rounded-lg"
              /> */}
            </div>

            <div>
              <Label className="text-sm font-medium">Select Issue Category</Label>
              <div className={`grid ${userType === "volunteer" ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"} gap-3 mt-3`}>
                {reportCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      className={`h-auto min-h-[80px] sm:min-h-[90px] p-3 sm:p-4 flex flex-col items-center justify-center gap-2 text-sm ${
                        selectedCategory === category.id ? "bg-gradient-primary shadow-lg" : "hover:shadow-md"
                      } transition-all duration-200`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0" />
                      <span className="text-xs sm:text-sm leading-tight text-center font-medium">{category.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Show title, description, priority fields only for non-volunteers */}
            {userType !== "volunteer" && (
              <>
                <div>
                  <Label htmlFor="title">{t('reports.issueTitle')}</Label>
                  <Input 
                    id="title"
                    placeholder={t('reports.issueTitle')}
                    value={reportData.title}
                    onChange={(e) => setReportData({...reportData, title: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="priority">{t('reports.priority')}</Label>
                  <select 
                    className="w-full p-2 border rounded-md bg-background"
                    value={reportData.priority}
                    onChange={(e) => setReportData({...reportData, priority: e.target.value})}
                  >
                    <option value="low">{t('common.low')} {t('reports.priority')}</option>
                    <option value="medium">{t('common.medium')} {t('reports.priority')}</option>
                    <option value="high">{t('common.high')} {t('reports.priority')}</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="description">{t('reports.description')}</Label>
                  <Textarea 
                    id="description"
                    placeholder={t('reports.description')}
                    value={reportData.description}
                    onChange={(e) => setReportData({...reportData, description: e.target.value})}
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="location">{t('reports.locationDetected')}</Label>
              <div className="flex gap-2">
                <Input 
                  id="location"
                  placeholder={userType === "volunteer" ? "Scan QR code to auto-fill location" : t('reports.location')}
                  value={reportData.location}
                  onChange={(e) => setReportData({...reportData, location: e.target.value})}
                  readOnly={userType === "volunteer"}
                  className={userType === "volunteer" ? "bg-muted" : ""}
                />
                {userType !== "volunteer" && (
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleGetLocation}
                    title={t('reports.getLocation')}
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {/* Show map when GPS coordinates are available */}
              {gpsCoordinates && (
                <div className="mt-4">
                  <MapView 
                    latitude={gpsCoordinates.lat} 
                    longitude={gpsCoordinates.lng}
                    address={reportData.location}
                  />
                </div>
              )}
            </div>

            {/* Photo Capture Section */}
            <div className="space-y-3">
              <Label>{t('reports.photos')} ({capturedPhotos.length})</Label>
              <div className="flex gap-2">
                <Button 
                  type="button"
                  onClick={handleOpenPhotoCapture}
                  variant="outline"
                  className="flex-1"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  {t('reports.takePhoto')}
                </Button>
                {capturedPhotos.length > 0 && (
                  <Button 
                    type="button"
                    onClick={() => setCapturedPhotos([])}
                    variant="outline"
                    size="sm"
                  >
                    <Image className="mr-1 h-4 w-4" />
                    {t('common.clear')}
                  </Button>
                )}
              </div>
              {capturedPhotos.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {capturedPhotos.slice(0, 3).map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`${t('photo.photo')} ${index + 1}`}
                      className="w-full h-16 object-cover rounded border"
                    />
                  ))}
                  {capturedPhotos.length > 3 && (
                    <div className="w-full h-16 bg-muted rounded border flex items-center justify-center text-xs text-muted-foreground">
                      +{capturedPhotos.length - 3} {t('common.more')}
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button 
              onClick={handleSubmitReport}
              className="w-full bg-gradient-primary"
              disabled={!selectedCategory || !reportData.location || (userType !== "volunteer" && !reportData.title) || isSubmitting}
            >
              <Send className="mr-2 h-4 w-4" />
              {isSubmitting ? t('common.submit') + "..." : t('reports.submitReport')}
            </Button>
          </CardContent>
        </Card>

        {/* Recent Reports - Mobile Focused */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5" />
              {t('reports.recentReports')}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {userType === "volunteer" && loggedInUser 
                ? `Your submitted reports as ${loggedInUser.name}` 
                : "Your submitted reports and community updates"
              }
            </p>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="space-y-3">
              {volunteerReports
                .filter(report => userType === "volunteer" && loggedInUser ? report.reporter === loggedInUser.name : true)
                .slice(0, 5)
                .map((report) => {
                const category = reportCategories.find(c => c.id === report.category);
                const Icon = category?.icon || MessageSquareWarning;
                
                return (
                  <div 
                    key={report.id} 
                    className="p-3 sm:p-4 rounded-xl border bg-gradient-to-r from-card/80 to-card/40 backdrop-blur-sm space-y-2 sm:space-y-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => onViewReportDetail?.(report)}
                  >
                    {/* Mobile-first header */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-gradient-primary/10 flex-shrink-0">
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm sm:text-base leading-tight truncate">{getCategoryName(report.category)}</h4>
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{report.location}</span>
                        </div>
                      </div>
                      {/* Status badge - mobile optimized */}
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(report.status)} text-xs px-2 py-1 flex-shrink-0`}
                      >
                        {getTranslatedStatus(report.status)}
                      </Badge>
                    </div>


                    {/* Bottom info - mobile layout */}
                    <div className="flex items-center justify-between pl-11 sm:pl-12 pt-1">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <User className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{getTranslatedReporter(report.reporter).replace(/^[^-]+ - /, '')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`${getPriorityColor(report.priority)} text-xs px-1.5 py-0.5`}
                        >
                          {report.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(report.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Empty state - mobile friendly */}
              {(() => {
                const filteredReports = volunteerReports.filter(report => 
                  userType === "volunteer" && loggedInUser ? report.reporter === loggedInUser.name : true
                );
                return filteredReports.length === 0 && (
                  <div className="text-center py-8 px-4">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-muted/20 flex items-center justify-center">
                      <MessageSquareWarning className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="font-medium text-sm mb-1">
                      {userType === "volunteer" && loggedInUser ? "No reports from you yet" : "No reports yet"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {userType === "volunteer" && loggedInUser 
                        ? `Submit your first report as ${loggedInUser.name} to help keep the community clean!`
                        : "Submit your first report to help keep the community clean!"
                      }
                    </p>
                  </div>
                );
              })()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Photo Capture Dialog */}
      <PhotoCapture
        isOpen={isPhotoCaptureOpen}
        onClose={handleClosePhotoCapture}
        onPhotosCapture={handlePhotosCapture}
        maxPhotos={5}
      />
    </div>
  );
}