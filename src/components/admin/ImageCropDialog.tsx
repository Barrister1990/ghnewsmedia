import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { AlertTriangle } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';

/** Featured images are stored at exactly this size: 16:9, wide enough for Google Discover. */
export const FEATURED_IMAGE_WIDTH = 1200;
export const FEATURED_IMAGE_HEIGHT = 675;

interface ImageCropDialogProps {
  /** Object URL (or same-origin URL) of the image to crop; null closes the dialog. */
  imageSrc: string | null;
  fileName?: string;
  onCancel: () => void;
  onCropped: (file: File) => void;
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load image'));
    img.src = src;
  });

/** Draws the selected area onto a 1200x675 canvas and returns it as a JPEG file. */
async function cropToFeaturedSize(src: string, area: Area, fileName: string): Promise<File> {
  const img = await loadImage(src);
  const canvas = document.createElement('canvas');
  canvas.width = FEATURED_IMAGE_WIDTH;
  canvas.height = FEATURED_IMAGE_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.88));
  if (!blob) throw new Error('Could not export image');
  const base = fileName.replace(/\.[^.]+$/, '') || 'featured';
  return new File([blob], `${base}-${FEATURED_IMAGE_WIDTH}x${FEATURED_IMAGE_HEIGHT}.jpg`, { type: 'image/jpeg' });
}

const ImageCropDialog: React.FC<ImageCropDialogProps> = ({ imageSrc, fileName = 'featured.jpg', onCancel, onCropped }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  const onCropComplete = useCallback((_: Area, pixels: Area) => setArea(pixels), []);
  const tooSmall = area !== null && area.width < FEATURED_IMAGE_WIDTH;

  const handleSave = async () => {
    if (!imageSrc || !area) return;
    setSaving(true);
    try {
      onCropped(await cropToFeaturedSize(imageSrc, area, fileName));
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={imageSrc !== null} onOpenChange={(open) => !open && !saving && onCancel()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Crop featured image</DialogTitle>
          <DialogDescription>
            Drag to position and use the slider to zoom. The image will be saved at {FEATURED_IMAGE_WIDTH}×{FEATURED_IMAGE_HEIGHT} (16:9).
          </DialogDescription>
        </DialogHeader>

        <div className="relative h-[55vh] min-h-[280px] w-full overflow-hidden rounded-md bg-stone-900">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              maxZoom={4}
              aspect={FEATURED_IMAGE_WIDTH / FEATURED_IMAGE_HEIGHT}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              objectFit="horizontal-cover"
            />
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-stone-600">Zoom</span>
          <Slider value={[zoom]} min={1} max={4} step={0.05} onValueChange={([z]) => setZoom(z)} className="flex-1" />
        </div>

        {tooSmall && (
          <p className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-2 text-sm text-amber-800">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            The selected area is only {Math.round(area!.width)}px wide, so it will be enlarged to {FEATURED_IMAGE_WIDTH}px and may look soft. Zoom out or use a larger photo for the best quality.
          </p>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={!area || saving}>
            {saving ? 'Cropping…' : 'Crop & upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropDialog;
