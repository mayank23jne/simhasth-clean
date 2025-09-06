import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera, X, Trash2, Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cameraManager } from "@/utils/cameraUtils";

interface PhotoCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotosCapture: (photos: string[]) => void;
  maxPhotos?: number;
}

export function PhotoCapture({ isOpen, onClose, onPhotosCapture, maxPhotos = 5 }: PhotoCaptureProps) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useLanguage();

  const startCamera = async () => {
    try {
      const mediaStream = await cameraManager.requestCameraAccess({
        facingMode: 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      });

      setStream(mediaStream);
      setIsCameraActive(true);
      
      try {
        // Wait for video element to be available
        const videoElement = await cameraManager.waitForVideoElement(() => videoRef.current);
        await cameraManager.setupVideoElement(videoElement, mediaStream);
        console.log('Photo capture camera ready');
      } catch (videoError) {
        console.error('Video element setup failed:', videoError);
        // Still set the stream directly as fallback
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        } else {
          throw new Error('Video element not found. Please try again.');
        }
      }
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      
      let errorMessage = cameraManager.getErrorMessage(error);
      
      // Special handling for video element not found error
      if (error.message && error.message.includes('Video element not found')) {
        errorMessage = 'Camera interface not ready. Please try clicking "Open Camera" button manually.';
        console.log('Video element not found - user can try manual camera button');
      }
      
      alert(errorMessage);
      setIsCameraActive(false);
      
      // Clean up stream if it was created
      if (stream) {
        cameraManager.stopStream(stream);
        setStream(null);
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      cameraManager.stopStream(stream);
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const photoDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedPhotos(prev => [...prev, photoDataUrl]);
      }
    }
  };

  const deletePhoto = (index: number) => {
    setCapturedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSavePhotos = () => {
    onPhotosCapture(capturedPhotos);
    handleClose();
  };

  const handleClose = () => {
    stopCamera();
    setCapturedPhotos([]);
    onClose();
  };

  useEffect(() => {
    return () => {
      // Cleanup camera stream on component unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Auto-start camera when dialog opens
  useEffect(() => {
    if (isOpen && !isCameraActive && !stream) {
      console.log('PhotoCapture dialog opened, starting camera in 200ms...');
      // Add a small delay to ensure the dialog and video element are fully rendered
      const timer = setTimeout(() => {
        console.log('PhotoCapture auto-starting camera now...');
        startCamera();
      }, 200);
      
      return () => {
        console.log('PhotoCapture dialog closed, clearing timer...');
        clearTimeout(timer);
      };
    }
  }, [isOpen, isCameraActive, stream]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('photo.title')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Camera Section */}
          <div className="flex flex-col items-center space-y-4">
            <Card className="w-full max-w-md aspect-video relative overflow-hidden bg-gradient-subtle shadow-card">
              {isCameraActive ? (
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
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
                  <div className="flex flex-col items-center space-y-4">
                    <Camera size={80} className="text-muted-foreground" />
                    <p className="text-sm text-muted-foreground text-center">
                      {t('photo.cameraPreview')}
                    </p>
                  </div>
                </div>
              )}
            </Card>

            {/* Camera Controls */}
            <div className="flex gap-3">
              {!isCameraActive ? (
                <Button onClick={startCamera} className="flex-1">
                  <Camera className="mr-2" size={16} />
                  {t('photo.openCamera')}
                </Button>
              ) : (
                <Button 
                  onClick={capturePhoto}
                  disabled={capturedPhotos.length >= maxPhotos}
                  className="flex-1"
                >
                  <Camera className="mr-2" size={16} />
                  {t('photo.takePhoto')} ({capturedPhotos.length}/{maxPhotos})
                </Button>
              )}
            </div>
          </div>

          {/* Captured Photos Grid */}
          {capturedPhotos.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">{t('photo.capturedPhotos')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {capturedPhotos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`${t('photo.photo')} ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => deletePhoto(index)}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleSavePhotos}
              disabled={capturedPhotos.length === 0}
              className="flex-1"
            >
              <Download className="mr-2" size={16} />
              {t('photo.savePhotos')} ({capturedPhotos.length})
            </Button>
            <Button variant="outline" onClick={handleClose}>
              {t('common.cancel')}
            </Button>
          </div>
        </div>

        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
}
