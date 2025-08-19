
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Copyright, Image as ImageIcon, Link, X } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface ImageUploadProps {
  value?: string;
  onChange?: (value: string) => void;
  credit?: string;
  onCreditChange?: (credit: string) => void;
  placeholder?: string;
  onImageUpload?: (imageUrl: string, credit: string) => void;
  onImageRemove?: () => void;
  currentImage?: string;
  currentCredit?: string;
  label?: string;
  description?: string;
  required?: boolean;
  type?: 'featured' | 'inline';
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  credit: propCredit,
  onCreditChange,
  placeholder,
  onImageUpload,
  onImageRemove,
  currentImage,
  currentCredit,
  label = 'Upload Image',
  description = 'Upload an image for your article',
  required = false,
  type = 'featured'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState(value || currentImage || '');
  const [credit, setCredit] = useState(propCredit || currentCredit || '');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const handleUrlInsert = () => {
    if (!urlInput.trim()) {
      toast.error('Please enter an image URL');
      return;
    }

    if (!urlInput.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)/i)) {
      toast.error('Please enter a valid image URL');
      return;
    }

    setImageUrl(urlInput);
    setUrlInput('');
    setShowUrlInput(false);
    toast.success('Image URL added successfully!');
  };

  const handleSave = () => {
    if (!imageUrl.trim()) {
      toast.error('Please upload or enter an image');
      return;
    }

    if (!credit.trim()) {
      toast.error('Image credit is required for copyright compliance');
      return;
    }

    // Handle both prop patterns
    if (onChange) {
      onChange(imageUrl);
    }
    if (onCreditChange) {
      onCreditChange(credit);
    }
    if (onImageUpload) {
      onImageUpload(imageUrl, credit);
    }
    
    toast.success('Image and credit saved successfully!');
  };

  const handleRemove = () => {
    setImageUrl('');
    setCredit('');
    
    // Handle both prop patterns
    if (onChange) {
      onChange('');
    }
    if (onCreditChange) {
      onCreditChange('');
    }
    if (onImageRemove) {
      onImageRemove();
    }
    
    toast.success('Image removed successfully!');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          {label}
          {required && <span className="text-red-500">*</span>}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 max-h-96 overflow-y-auto">
        {/* Current Image Display */}
        {imageUrl && (
          <div className="relative">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg border border-gray-200"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* URL Input Option */}
        {!imageUrl && (
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="w-full"
            >
              {showUrlInput ? 'Hide URL Input' : 'Insert Image by URL'}
            </Button>
            
            {showUrlInput && (
              <div className="space-y-2">
                <Input
                  type="url"
                  placeholder="Enter image URL (https://example.com/image.jpg)"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleUrlInsert}
                  className="w-full"
                >
                  <Link className="w-4 h-4 mr-2" />
                  Insert Image
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Image Credit Input */}
        {imageUrl && (
          <div className="space-y-2">
            <Label htmlFor="image-credit-input" className="flex items-center gap-2">
              <Copyright className="w-4 h-4" />
              Image Credit *
              <span className="text-red-500">Required</span>
            </Label>
            <Input
              id="image-credit-input"
              type="text"
              placeholder="e.g., Photo by John Doe, Source: Unsplash, © 2024 Company Name"
              value={credit}
              onChange={(e) => setCredit(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Provide proper attribution to avoid copyright issues. Include photographer name, source, or copyright holder.
            </p>
          </div>
        )}

        {/* Copyright Guidelines */}
        {imageUrl && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Copyright Guidelines:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Always credit the original photographer/artist</li>
                  <li>• Include source website or platform</li>
                  <li>• Respect Creative Commons licenses</li>
                  <li>• When in doubt, seek permission</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        {imageUrl && credit && (
          <Button
            type="button"
            onClick={handleSave}
            className="w-full"
            disabled={isUploading}
          >
            Save Image & Credit
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUpload;
