
import { Button } from '@/components/ui/button';
import React from 'react';

interface PlaceholderImagesProps {
  onImageSelect: (imageId: string) => void;
}

const PlaceholderImages: React.FC<PlaceholderImagesProps> = ({ onImageSelect }) => {
  const placeholderImages = [
    '/photo-1649972904349-6e44c42644a7',
    '/photo-1488590528505-98d2b5aba04b',
    '/photo-1518770660439-4636190af475',
    '/photo-1461749280684-dccba630e2f6',
    '/photo-1486312338219-ce68d2c6f44d'
  ];

  return (
    <div className="text-xs text-gray-500">
      <p>Quick placeholder images:</p>
      <div className="flex flex-wrap gap-1 mt-1">
        {placeholderImages.map((photo) => (
          <Button
            key={photo}
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs h-6 px-2"
            onClick={() => onImageSelect(photo)}
          >
            {photo.split('-')[1]}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default PlaceholderImages;
