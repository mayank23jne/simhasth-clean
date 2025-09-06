export interface CameraConstraints {
  width?: { ideal: number };
  height?: { ideal: number };
  facingMode?: 'user' | 'environment';
}

export interface CameraError {
  name: string;
  message: string;
}

export class CameraManager {
  private static instance: CameraManager;
  private activeStreams: MediaStream[] = [];

  static getInstance(): CameraManager {
    if (!CameraManager.instance) {
      CameraManager.instance = new CameraManager();
    }
    return CameraManager.instance;
  }

  async requestCameraAccess(constraints: CameraConstraints = {}): Promise<MediaStream> {
    // Check if camera API is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Camera API not supported in this browser');
    }

    // Check if we're on HTTPS (required for camera access)
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      throw new Error('Camera access requires HTTPS');
    }

    const defaultConstraints = {
      width: { ideal: 1280 },
      height: { ideal: 720 },
      facingMode: 'environment' as const,
      ...constraints
    };

    // Try with specified camera first, fallback to any camera
    let mediaStream: MediaStream;
    
    try {
      console.log('Requesting camera with constraints:', defaultConstraints);
      mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: defaultConstraints
      });
    } catch (specificCameraError) {
      console.log('Specific camera failed, trying any camera:', specificCameraError);
      
      // Fallback to any available camera
      const fallbackConstraints = {
        width: defaultConstraints.width,
        height: defaultConstraints.height
      };
      
      mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: fallbackConstraints
      });
    }

    // Track active streams for cleanup
    this.activeStreams.push(mediaStream);
    console.log('Camera access granted successfully');
    
    return mediaStream;
  }

  stopStream(stream: MediaStream): void {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
        console.log('Camera track stopped:', track.kind);
      });
      
      // Remove from active streams
      this.activeStreams = this.activeStreams.filter(s => s !== stream);
    }
  }

  stopAllStreams(): void {
    this.activeStreams.forEach(stream => {
      stream.getTracks().forEach(track => track.stop());
    });
    this.activeStreams = [];
    console.log('All camera streams stopped');
  }

  async setupVideoElement(videoElement: HTMLVideoElement | null, stream: MediaStream): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!videoElement) {
        reject(new Error('Video element not found'));
        return;
      }

      const handleLoadedMetadata = () => {
        console.log('Video element loaded successfully');
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        videoElement.removeEventListener('error', handleError);
        resolve();
      };

      const handleError = (error: Event) => {
        console.error('Video element error:', error);
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        videoElement.removeEventListener('error', handleError);
        reject(new Error('Failed to load video stream'));
      };

      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.addEventListener('error', handleError);
      
      videoElement.srcObject = stream;
      
      // Force play if needed
      videoElement.play().catch(playError => {
        console.log('Video autoplay failed (this is normal on some browsers):', playError);
        // Don't reject here as the video might still work
      });

      // Timeout after 10 seconds
      setTimeout(() => {
        if (videoElement.readyState === 0) {
          handleError(new Event('timeout'));
        }
      }, 10000);
    });
  }

  async waitForVideoElement(getVideoElement: () => HTMLVideoElement | null, maxRetries: number = 10): Promise<HTMLVideoElement> {
    return new Promise((resolve, reject) => {
      let retries = 0;
      
      const checkElement = () => {
        const element = getVideoElement();
        if (element) {
          console.log('Video element found after', retries, 'retries');
          resolve(element);
          return;
        }
        
        retries++;
        if (retries >= maxRetries) {
          reject(new Error('Video element not found after maximum retries'));
          return;
        }
        
        console.log('Video element not ready, retrying...', retries);
        setTimeout(checkElement, 100); // Wait 100ms between retries
      };
      
      checkElement();
    });
  }

  getErrorMessage(error: any): string {
    if (error.name === 'NotAllowedError') {
      return 'Camera permission denied. Please allow camera access and try again.';
    } else if (error.name === 'NotFoundError') {
      return 'No camera found on this device.';
    } else if (error.name === 'NotSupportedError') {
      return 'Camera not supported on this browser.';
    } else if (error.name === 'NotReadableError') {
      return 'Camera is already in use by another application.';
    } else if (error.name === 'OverconstrainedError') {
      return 'Camera constraints cannot be satisfied. Trying with different settings...';
    } else if (error.message?.includes('HTTPS')) {
      return 'Camera access requires HTTPS. Please use a secure connection.';
    } else if (error.message?.includes('not supported')) {
      return 'Camera API not supported in this browser. Please use Chrome, Firefox, or Safari.';
    } else {
      return error.message || 'Unknown camera error occurred.';
    }
  }

  async checkCameraAvailability(): Promise<boolean> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return false;
      }

      // Try to enumerate devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasCamera = devices.some(device => device.kind === 'videoinput');
      
      return hasCamera;
    } catch (error) {
      console.error('Error checking camera availability:', error);
      return false;
    }
  }
}

export const cameraManager = CameraManager.getInstance();
