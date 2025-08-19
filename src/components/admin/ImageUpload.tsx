
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { uploadArticleImage } from '@/lib/supabase-storage';
import { AlertTriangle, Copyright, Image as ImageIcon, Link, Upload, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Upload using utility function
      const result = await uploadArticleImage(file, type);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success && result.url) {
        setImageUrl(result.url);
        toast.success('Image uploaded successfully!');
        
        // Update form values
        if (onChange) {
          onChange(result.url);
        }
        if (onImageUpload) {
          onImageUpload(result.url, credit);
        }
      } else {
        toast.error(result.error || 'Failed to upload image');
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
    
    // Update form values
    if (onChange) {
      onChange(urlInput);
    }
    if (onImageUpload) {
      onImageUpload(urlInput, credit);
    }
    
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
      <CardContent className="space-y-4 h-[70vh] overflow-y-auto">
        {/* Current Image Display */}
        {imageUrl && (
          <div className="relative">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-36 object-cover rounded-lg border border-gray-200"
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

        {/* Upload Options */}
        {!imageUrl && (
          <div className="space-y-3">
            {/* Local File Upload */}
            <div className="space-y-2">
              <Label htmlFor="file-upload" className="flex items-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                Upload from Device
              </Label>
              <Input
                id="file-upload"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
                disabled={isUploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Choose File'}
              </Button>
              {isUploading && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
              <p className="text-xs text-gray-500">
                Supported formats: JPEG, PNG, GIF, WebP (max 5MB)
              </p>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or</span>
              </div>
            </div>

            {/* URL Input Option */}
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
