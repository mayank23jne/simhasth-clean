import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QrCode, Scan, AlertCircle, Camera, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ScannerProps {
  onScanComplete?: (locationData?: { location: string; coordinates: { lat: number; lng: number } }) => void;
}

export function Scanner({ onScanComplete }: ScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { t } = useLanguage();

  const startCamera = async () => {
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

      console.log('Camera access granted');
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
            videoElement?.removeEventListener('loadedmetadata', handleLoadedMetadata);
          };
          
          videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
          
          // Force play if needed
          videoElement.play().catch(playError => {
            console.log('Video play failed:', playError);
          });
        } else {
          console.log('Video element not found after retries');
          // Don't throw error, continue with demo mode fallback
        }
      } catch (videoSetupError) {
        console.error('Video setup error:', videoSetupError);
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
      
      alert(errorMessage);
      
      // Fallback to demo mode if camera access fails
      handleDemoScan();
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const getCurrentLocationAndComplete = (facilityName: string) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Create location string with actual coordinates
          const locationString = `${facilityName}, Ujjain (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`;
          
          const scannedLocationData = {
            location: locationString,
            coordinates: { lat: latitude, lng: longitude }
          };
          
          console.log('Real GPS location captured:', scannedLocationData);
          onScanComplete?.(scannedLocationData);
        },
        (error) => {
          console.error('Error getting location:', error);
          
          // Fallback to approximate Ujjain coordinates if GPS fails
          let fallbackCoords = { lat: 22.7196, lng: 75.8577 };
          if (facilityName.includes("Bus Station")) {
            fallbackCoords = { lat: 22.7156, lng: 75.8572 };
          }
          
          const fallbackLocationData = {
            location: `${facilityName}, Ujjain (GPS unavailable)`,
            coordinates: fallbackCoords
          };
          
          // Show error message to user
          let errorMessage = 'Could not get precise location. ';
          if (error.code === error.PERMISSION_DENIED) {
            errorMessage += 'Location access denied. Using approximate location.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMessage += 'Location unavailable. Using approximate location.';
          } else if (error.code === error.TIMEOUT) {
            errorMessage += 'Location request timed out. Using approximate location.';
          }
          
          alert(errorMessage);
          onScanComplete?.(fallbackLocationData);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      // Geolocation not supported
      const fallbackLocationData = {
        location: `${facilityName}, Ujjain (GPS not supported)`,
        coordinates: { lat: 22.7196, lng: 75.8577 }
      };
      
      alert('Geolocation is not supported by this browser. Using approximate location.');
      onScanComplete?.(fallbackLocationData);
    }
  };

  const handleScan = () => {
    if (isCameraActive) {
      setIsScanning(true);
      // Simulate QR detection after 3 seconds
      setTimeout(() => {
        setIsScanning(false);
        stopCamera();
        
        // Get actual device location
        getCurrentLocationAndComplete("Central Park - Block A, Simhastha Grounds");
      }, 3000);
    } else {
      startCamera();
    }
  };

  const handleDemoScan = () => {
    setIsScanning(true);
    // Demo mode - simulate scanning delay
    setTimeout(() => {
      setIsScanning(false);
      
      // Get actual device location for demo scan too
      getCurrentLocationAndComplete("Bus Station - Platform 2, Simhastha Grounds");
    }, 2000);
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
    <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center p-3 sm:p-4 space-y-4 sm:space-y-6">
      <div className="text-center space-y-1 sm:space-y-2">
        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          {t('scanner.title')}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {t('scanner.subtitle')}
        </p>
      </div>

      <Card className="w-full max-w-xs sm:max-w-sm aspect-square relative overflow-hidden bg-gradient-subtle shadow-card">
        {isCameraActive ? (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* QR Scanner Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-48 h-48 border-2 border-primary rounded-lg">
                <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-primary rounded-tl-lg"></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-primary rounded-tr-lg"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-primary rounded-bl-lg"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-primary rounded-br-lg"></div>
                {isScanning && (
                  <div className="absolute inset-0 bg-primary/20 animate-pulse rounded-lg flex items-center justify-center">
                    <QrCode size={40} className="text-white animate-pulse" />
                  </div>
                )}
              </div>
            </div>
            {/* Close Camera Button */}
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-2 right-2 h-8 w-8 p-0"
              onClick={stopCamera}
            >
              <X size={16} />
            </Button>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            {isScanning ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <QrCode size={80} className="text-primary animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-primary opacity-20 animate-ping rounded-lg"></div>
                </div>
                <p className="text-sm text-muted-foreground animate-pulse">
                  {t('scanner.scanning')}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <div className="relative p-6 rounded-2xl border-2 border-dashed border-border">
                  <QrCode size={80} className="text-muted-foreground" />
                  <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-primary rounded-tl-lg"></div>
                  <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-primary rounded-tr-lg"></div>
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-primary rounded-bl-lg"></div>
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-primary rounded-br-lg"></div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  {t('scanner.positionQR')}
                </p>
              </div>
            )}
          </div>
        )}
      </Card>

      <div className="w-full max-w-xs sm:max-w-sm space-y-3 sm:space-y-4">
        <Button 
          onClick={handleScan}
          disabled={isScanning}
          className="w-full h-12 sm:h-14 text-base sm:text-lg bg-gradient-primary hover:shadow-glow transition-smooth"
          size="lg"
        >
          {isCameraActive ? (
            <>
              <QrCode className="mr-2" size={20} />
              {isScanning ? t('scanner.scanning') : t('scanner.scanQR')}
            </>
          ) : (
            <>
              <Camera className="mr-2" size={20} />
              {t('scanner.openCamera')}
            </>
          )}
        </Button>

        {!isCameraActive && (
          <Button 
            onClick={handleDemoScan}
            disabled={isScanning}
            variant="outline"
            className="w-full h-10 text-sm"
            size="lg"
          >
            <Scan className="mr-2" size={16} />
            {isScanning ? t('scanner.scanning') : t('scanner.demoMode')}
          </Button>
        )}

        <Card className="p-3 sm:p-4 bg-info/10 border-info/20">
          <div className="flex items-start space-x-2 sm:space-x-3">
            <AlertCircle className="text-info mt-0.5 flex-shrink-0" size={16} />
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-info-foreground">
                {isCameraActive ? t('scanner.cameraActive') : t('scanner.cameraInfo')}
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
                {isCameraActive ? t('scanner.cameraActiveDesc') : t('scanner.cameraInfoDesc')}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}