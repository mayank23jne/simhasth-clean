import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAudit } from "@/contexts/AuditContext";
import { useStaff } from "@/contexts/StaffContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { PhotoCapture } from "@/components/PhotoCapture";
import { formatTimestamp } from "@/lib/utils";
import { toast } from "sonner";
import { 
  QrCode, 
  Camera, 
  MapPin, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Scan,
  Image,
  X
} from "lucide-react";
import qrScanImage from "@/assets/qr-scan.jpg";

const mockAuditData = {
  facilityId: "T001",
  location: "Central Park - Block A",
  lastCleaned: "2024-01-15 14:30",
  assignedStaff: "Raj Kumar",
  qrCode: "CSG001A"
};

interface QRAuditProps {
  loggedInUser?: { username: string; name: string } | null;
}

export function QRAudit({ loggedInUser }: QRAuditProps) {
  const { addAuditReport, getRecentAudits } = useAudit();
  const { getActiveStaff, getStaffByName } = useStaff();
  const { t } = useLanguage();
  const [isScanning, setIsScanning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPhotoCaptureOpen, setIsPhotoCaptureOpen] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  
  // Get recent audits from context
  const recentAudits = getRecentAudits(3);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [auditData, setAuditData] = useState({
    facilityId: "",
    staffId: ""
  });
  const [scannedLocation, setScannedLocation] = useState<string>("");
  const [gpsCoordinates, setGpsCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  // Auto-prefill staff ID when component mounts or loggedInUser changes
  useEffect(() => {
    if (loggedInUser && loggedInUser.name) {
      const staffMember = getStaffByName(loggedInUser.name);
      if (staffMember) {
        setAuditData(prev => ({ ...prev, staffId: staffMember.id }));
      }
    }
  }, [loggedInUser, getStaffByName]);

  const startQRCamera = async () => {
    console.log('startQRCamera called');
    try {
      // Check if camera API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }

      // Check if we're on HTTPS (required for camera access)
      if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        throw new Error('Camera access requires HTTPS');
      }

      console.log('Requesting camera access...');
      
      // Try with back camera first, fallback to any camera
      let constraints = { 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      };

      let mediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (backCameraError) {
        console.log('Back camera failed, trying any camera:', backCameraError);
        // Fallback to any available camera
        constraints = { 
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        } as any;
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      }

      console.log('Camera access granted, setting stream...');
      setStream(mediaStream);
      setIsCameraActive(true);
      
      // Wait for video element to be available with retry mechanism
      try {
        let videoElement = videoRef.current;
        
        // If video element is not immediately available, wait for it
        if (!videoElement) {
          console.log('Video element not ready, waiting...');
          // Wait a bit for React to render the video element
          await new Promise(resolve => setTimeout(resolve, 100));
          videoElement = videoRef.current;
          
          // If still not available after waiting, try a few more times
          let retries = 0;
          while (!videoElement && retries < 10) {
            console.log('Retrying to find video element...', retries + 1);
            await new Promise(resolve => setTimeout(resolve, 100));
            videoElement = videoRef.current;
            retries++;
          }
        }
        
        if (videoElement) {
          videoElement.srcObject = mediaStream;
          console.log('Video stream set to video element');
          
          // Wait for video to load before showing success
          const handleLoadedMetadata = () => {
            console.log('Video loaded successfully');
            toast.success('Camera opened successfully! Point at QR code to scan.');
            videoElement?.removeEventListener('loadedmetadata', handleLoadedMetadata);
          };
          
          videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
          
          // Force play if needed
          videoElement.play().catch(playError => {
            console.log('Video play failed:', playError);
          });
        } else {
          console.log('videoRef.current is still null after retries');
          toast.error('Video element not found. Please try again.');
          // Don't throw error, let the camera stream continue for fallback
        }
      } catch (videoSetupError) {
        console.error('Video setup error:', videoSetupError);
        toast.error('Failed to setup video. Please try again.');
      }
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      
      let errorMessage = 'Unable to access camera. ';
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera permissions and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera found on this device.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage += 'Camera not supported on this browser.';
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'Camera is already in use by another application.';
      } else if (error.message.includes('HTTPS')) {
        errorMessage += 'Camera access requires HTTPS. Please use a secure connection.';
      } else if (error.message.includes('not supported')) {
        errorMessage += 'Camera API not supported in this browser. Please use Chrome, Firefox, or Safari.';
      } else {
        errorMessage += error.message || 'Unknown error occurred.';
      }
      
      toast.error(errorMessage);
      
      // Fallback to demo mode if camera access fails
      handleDemoScan();
    }
  };

  const stopQRCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const getCurrentLocationAndSetAuditData = (facilityName: string) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Create location string with actual coordinates
          const locationString = `${facilityName}, Simhastha Grounds, Ujjain (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`;
          
          setScannedLocation(locationString);
          setGpsCoordinates({ lat: latitude, lng: longitude });
          setAuditData({
            ...auditData,
            facilityId: mockAuditData.facilityId
          });
          
          console.log('Real GPS location captured for audit:', { locationString, coordinates: { lat: latitude, lng: longitude } });
          toast.success("QR scanned! Location captured with GPS coordinates.");
        },
        (error) => {
          console.error('Error getting location:', error);
          
          // Fallback to approximate Ujjain coordinates if GPS fails
          const fallbackCoords = { lat: 22.7196, lng: 75.8577 };
          const fallbackLocationString = `${facilityName}, Simhastha Grounds, Ujjain (GPS unavailable)`;
          
          setScannedLocation(fallbackLocationString);
          setGpsCoordinates(fallbackCoords);
          setAuditData({
            ...auditData,
            facilityId: mockAuditData.facilityId
          });
          
          // Show error message to user
          let errorMessage = 'Could not get precise location. ';
          if (error.code === error.PERMISSION_DENIED) {
            errorMessage += 'Location access denied. Using approximate location.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMessage += 'Location unavailable. Using approximate location.';
          } else if (error.code === error.TIMEOUT) {
            errorMessage += 'Location request timed out. Using approximate location.';
          }
          
          toast.error(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      // Geolocation not supported
      const fallbackLocationString = `${facilityName}, Simhastha Grounds, Ujjain (GPS not supported)`;
      const fallbackCoords = { lat: 22.7196, lng: 75.8577 };
      
      setScannedLocation(fallbackLocationString);
      setGpsCoordinates(fallbackCoords);
      setAuditData({
        ...auditData,
        facilityId: mockAuditData.facilityId
      });
      
      toast.error('Geolocation is not supported by this browser. Using approximate location.');
    }
  };

  const handleScan = () => {
    console.log('handleScan called, isCameraActive:', isCameraActive);
    if (isCameraActive) {
      setIsScanning(true);
      // Simulate QR detection after 3 seconds
      setTimeout(() => {
        setIsScanning(false);
        stopQRCamera();
        
        // Get real GPS location when QR is scanned
        getCurrentLocationAndSetAuditData(mockAuditData.location);
      }, 3000);
    } else {
      console.log('Starting QR camera...');
      startQRCamera();
    }
  };

  const handleDemoScan = () => {
    setIsScanning(true);
    // Demo mode - simulate scanning delay
    setTimeout(() => {
      setIsScanning(false);
      
      // Get real GPS location for demo scan too
      getCurrentLocationAndSetAuditData("Bus Station - Platform 2");
    }, 2000);
  };

  const handleSubmitAudit = () => {
    if (!auditData.facilityId || !auditData.staffId) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Add audit report to context
      console.log('Submitting audit with photos:', capturedPhotos.length, 'photos');
      console.log('Photos data preview:', capturedPhotos.map(p => p.substring(0, 50) + '...'));
      
      const auditReport: any = {
        facilityId: auditData.facilityId,
        facilityLocation: scannedLocation || mockAuditData.location,
        staffId: auditData.staffId,
        staffName: getActiveStaff().find(staff => staff.id === auditData.staffId)?.name || "Unknown Staff",
        cleaningType: "routine",
        issues: "",
        notes: "Cleaning confirmation completed via mobile app",
        qrCode: mockAuditData.qrCode,
        status: 'completed',
        photos: capturedPhotos.length > 0 ? capturedPhotos : undefined
      };
      
      if (gpsCoordinates) {
        auditReport.coordinates = gpsCoordinates;
      }
      
      addAuditReport(auditReport);

      toast.success("Cleaning confirmation submitted successfully! Admin can now view this report.");
      
      // Reset form
      setAuditData({
        facilityId: "",
        staffId: ""
      });
      setScannedLocation("");
      setGpsCoordinates(null);
      setCapturedPhotos([]);
      
      setIsSubmitting(false);
    }, 1500);
  };

  const handlePhotosCapture = (photos: string[]) => {
    console.log('Photos captured in QRaudit:', photos.length, 'photos');
    setCapturedPhotos(photos);
    toast.success(`${photos.length} ${t('photo.capturedPhotos')} ${t('common.saved')}`);
  };

  useEffect(() => {
    return () => {
      // Cleanup camera stream on component unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-subtle rounded-lg p-4 lg:p-6 shadow-card">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">{t('qraudit.title')}</h1>
        <p className="text-muted-foreground text-sm lg:text-base">
          {t('qraudit.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Scanner Section */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              {t('qraudit.qrCodeScanner')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              {isCameraActive ? (
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* QR Scanner Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-32 h-32 border-2 border-primary rounded-lg">
                      <div className="absolute top-1 left-1 w-4 h-4 border-l-2 border-t-2 border-primary rounded-tl-lg"></div>
                      <div className="absolute top-1 right-1 w-4 h-4 border-r-2 border-t-2 border-primary rounded-tr-lg"></div>
                      <div className="absolute bottom-1 left-1 w-4 h-4 border-l-2 border-b-2 border-primary rounded-bl-lg"></div>
                      <div className="absolute bottom-1 right-1 w-4 h-4 border-r-2 border-b-2 border-primary rounded-br-lg"></div>
                      {isScanning && (
                        <div className="absolute inset-0 bg-primary/20 animate-pulse rounded-lg flex items-center justify-center">
                          <QrCode size={24} className="text-white animate-pulse" />
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Close Camera Button */}
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 right-2 h-8 w-8 p-0"
                    onClick={stopQRCamera}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <>
                  <img 
                    src={qrScanImage}
                    alt="QR Code Scanning"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                    {isScanning ? (
                      <div className="flex flex-col items-center space-y-2 text-white">
                        <Scan className="h-8 w-8 animate-spin" />
                        <span className="text-sm">{t('qraudit.scanning')}</span>
                      </div>
                    ) : (
                      <Button 
                        onClick={handleScan}
                        disabled={isScanning}
                        className="bg-gradient-primary shadow-glow"
                        size="lg"
                      >
                        <Camera className="mr-2 h-5 w-5" />
                        {t('qraudit.openCamera')}
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Camera Controls */}
            {isCameraActive && (
              <div className="flex gap-2">
                <Button 
                  onClick={handleScan}
                  disabled={isScanning}
                  className="flex-1 bg-gradient-primary"
                >
                  {isScanning ? (
                    <>
                      <Scan className="mr-2 h-4 w-4 animate-spin" />
                      {t('qraudit.scanning')}
                    </>
                  ) : (
                    <>
                      <QrCode className="mr-2 h-4 w-4" />
                      {t('qraudit.scanQR')}
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Demo Mode Button */}
            {!isCameraActive && !isScanning && (
              <Button 
                onClick={handleDemoScan}
                variant="outline"
                className="w-full"
                size="sm"
              >
                <Scan className="mr-2 h-4 w-4" />
                {t('qraudit.demoMode')}
              </Button>
            )}

            {auditData.facilityId && (
              <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span className="font-medium text-success">QR Code Detected</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Facility ID:</span>
                    <Badge variant="outline">{mockAuditData.facilityId}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="text-muted-foreground">{mockAuditData.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>QR Code:</span>
                    <span className="text-muted-foreground">{mockAuditData.qrCode}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Audit Form */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              {t('qraudit.cleaningAuditForm')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="staffId">{t('qraudit.staffMember')}</Label>
                <Select 
                  value={auditData.staffId} 
                  onValueChange={(value) => setAuditData({...auditData, staffId: value})}
                  disabled={!!loggedInUser} // Disable when staff is logged in
                >
                  <SelectTrigger className={loggedInUser ? "opacity-60 cursor-not-allowed" : ""}>
                    <SelectValue placeholder={
                      loggedInUser 
                        ? `${loggedInUser.name} (${t('qraudit.loggedInStaff')})` 
                        : t('qraudit.enterStaffId')
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {getActiveStaff().map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.name} - {staff.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {loggedInUser && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('qraudit.staffAutoSelected')}
                  </p>
                )}
              </div>
            </div>

            {/* Location Display */}
            {scannedLocation && (
              <div className="space-y-2">
                <Label>{t('reports.location')}</Label>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm">{scannedLocation}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Photo Capture Section */}
            <div className="space-y-3">
              <Label>{t('qraudit.photos')} ({capturedPhotos.length})</Label>
              <div className="flex gap-2">
                <Button 
                  type="button"
                  onClick={() => setIsPhotoCaptureOpen(true)}
                  variant="outline"
                  className="flex-1"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  {t('qraudit.takePhotos')}
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
              onClick={handleSubmitAudit}
              className="w-full bg-gradient-clean"
              disabled={!auditData.facilityId || !auditData.staffId || isSubmitting}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {isSubmitting ? t('qraudit.submittingAudit') : t('qraudit.submitAudit')}
            </Button>

            {/* Quick Demo Button */}
            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground mb-2 text-center">{t('qraudit.quickDemo')}</p>
              <Button 
                onClick={() => {
                  setAuditData({
                    facilityId: "T001",
                    staffId: "staff1"
                  });
                }}
                variant="outline"
                className="w-full text-xs"
                size="sm"
              >
                {t('qraudit.fillSampleData')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Audits */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Audits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAudits.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>{t('qraudit.noRecentAudits')}</p>
                <p className="text-sm">{t('qraudit.submitFirstAudit')}</p>
              </div>
            ) : (
              recentAudits.map((audit) => (
                <div key={audit.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{audit.facilityLocation}</div>
                      <div className="text-sm text-muted-foreground">
                        {t('common.by')} {audit.staffName} • {formatTimestamp(audit.timestamp).full}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={
                      audit.status === "completed" ? "text-success" : "text-warning"
                    }>
                      {audit.status === "completed" ? t('status.completed') : t('status.issuesFound')}
                    </Badge>
                    {audit.status === "completed" ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-warning" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Photo Capture Dialog */}
      <PhotoCapture
        isOpen={isPhotoCaptureOpen}
        onClose={() => setIsPhotoCaptureOpen(false)}
        onPhotosCapture={handlePhotosCapture}
        maxPhotos={5}
      />
    </div>
  );
}