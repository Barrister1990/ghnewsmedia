
import React from 'react';
import ImagePreview from './ImagePreview';
import UploadArea from './UploadArea';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  placeholder?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  placeholder = 'Upload or enter image URL'
}) => {
  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className="space-y-4">
      {value ? (
        <ImagePreview imageUrl={value} onRemove={handleRemove} />
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
