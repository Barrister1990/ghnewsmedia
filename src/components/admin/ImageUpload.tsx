
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';
import ImagePreview from './ImagePreview';
import UploadArea from './UploadArea';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  credit?: string;
  onCreditChange: (credit: string) => void;
  placeholder?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  credit,
  onCreditChange,
  placeholder = 'Upload or enter image URL'
}) => {
  const handleRemove = () => {
    onChange('');
    onCreditChange('');
  };

  return (
    <div className="space-y-4">
      {value ? (
        <div>
          <ImagePreview imageUrl={value} onRemove={handleRemove} />
          <div className="mt-2">
            <Label htmlFor="image-credit">Image Credit</Label>
            <Input
              id="image-credit"
              type="text"
              placeholder="Enter image credit..."
              value={credit}
              onChange={(e) => onCreditChange(e.target.value)}
            />
          </div>
        </div>
      ) : (
        <UploadArea placeholder={placeholder} onImageUpload={onChange} />
      )}
      
      <p className="text-xs text-gray-500">
        Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB
      </p>
    </div>
  );
};

export default ImageUpload;
