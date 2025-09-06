import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Image, X, Download } from "lucide-react";

interface AuditPhotosDialogProps {
  isOpen: boolean;
  onClose: () => void;
  photos: string[];
  auditId: string;
  facilityLocation: string;
}

export function AuditPhotosDialog({ 
  isOpen, 
  onClose, 
  photos, 
  auditId, 
  facilityLocation 
}: AuditPhotosDialogProps) {
  const { t } = useLanguage();

  const downloadPhoto = (photoUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = photoUrl;
    link.download = `audit-${auditId}-photo-${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            {t('staffAudit.auditPhotos')} - {auditId}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {facilityLocation} • {photos.length} {t('staffAudit.photosCount')}
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {photos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 border-2 border-dashed border-muted rounded-lg">
              <Image className="h-16 w-16 text-muted-foreground/50" />
              <div className="text-center">
                <p className="font-medium text-muted-foreground">{t('staffAudit.noPhotos')}</p>
                <p className="text-sm text-muted-foreground">{t('staffAudit.noPhotosDescription')}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="space-y-3">
                  <div className="relative group">
                    <img
                      src={photo}
                      alt={`${t('staffAudit.auditPhoto')} ${index + 1}`}
                      className="w-full h-48 sm:h-56 object-cover rounded-lg border shadow-sm group-hover:shadow-md transition-shadow"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg" />
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => downloadPhoto(photo, index)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">
                      {t('staffAudit.photo')} {index + 1} {t('common.of')} {photos.length}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('staffAudit.clickToDownload')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {photos.length > 0 && (
                <span>
                  {t('staffAudit.totalPhotos')}: {photos.length}
                </span>
              )}
            </div>
            <Button onClick={onClose} variant="outline">
              <X className="h-4 w-4 mr-2" />
              {t('common.close')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
