
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, Copyright, Image as ImageIcon, Link, Upload, X } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

interface ImageUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImageInsert: (url: string, alt: string, credit: string) => void;
}

const ImageUploadDialog: React.FC<ImageUploadDialogProps> = ({
  isOpen,
  onClose,
  onImageInsert
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [credit, setCredit] = useState('');
  const [urlInput, setUrlInput] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Generate unique filename without subfolder structure
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload directly to the root of the bucket (no subfolders)
      const { data, error } = await supabase.storage
        .from('article-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('article-images')
        .getPublicUrl(fileName);

      setImageUrl(publicUrl);
      setUploadProgress(100);
      
      // Auto-focus on alt text input
      setTimeout(() => {
        const altInput = document.getElementById('alt-text-input');
        if (altInput) altInput.focus();
      }, 100);

      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false
  });

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
    toast.success('Image URL added successfully!');
  };

  const handleInsert = () => {
    if (!imageUrl.trim()) {
      toast.error('Please upload or enter an image');
      return;
    }

    if (!altText.trim()) {
      toast.error('Alt text is required for accessibility');
      return;
    }

    if (!credit.trim()) {
      toast.error('Image credit is required for copyright compliance');
      return;
    }

    onImageInsert(imageUrl, altText, credit);
    handleClose();
    toast.success('Image inserted successfully!');
  };

  const handleClose = () => {
    setImageUrl('');
    setAltText('');
    setCredit('');
    setUrlInput('');
    setUploadProgress(0);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Insert Image
          </DialogTitle>
          <DialogDescription>
            Upload an image or insert by URL. All images require proper credits for copyright compliance.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Image</TabsTrigger>
            <TabsTrigger value="url">Insert by URL</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            {/* Upload Area */}
            {!imageUrl && (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {isDragActive ? 'Drop the image here' : 'Drag & drop an image here'}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  or click to select a file
                </p>
                <p className="text-xs text-gray-400">
                  Supports: JPG, PNG, GIF, WebP (max 5MB)
                </p>
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url-input">Image URL</Label>
              <Input
                id="url-input"
                type="url"
                placeholder="https://example.com/image.jpg"
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
          </TabsContent>
        </Tabs>

        {/* Image Preview */}
        {imageUrl && (
          <div className="space-y-4">
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
                onClick={() => setImageUrl('')}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Alt Text Input */}
            <div className="space-y-2">
              <Label htmlFor="alt-text-input">
                Alt Text *
                <span className="text-red-500 ml-1">Required</span>
              </Label>
              <Input
                id="alt-text-input"
                type="text"
                placeholder="Describe the image for accessibility"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Alt text helps screen readers and improves SEO
              </p>
            </div>

            {/* Image Credit Input */}
            <div className="space-y-2">
              <Label htmlFor="credit-input" className="flex items-center gap-2">
                <Copyright className="w-4 h-4" />
                Image Credit *
                <span className="text-red-500">Required</span>
              </Label>
              <Input
                id="credit-input"
                type="text"
                placeholder="e.g., Photo by John Doe, Source: Unsplash, © 2024 Company Name"
                value={credit}
                onChange={(e) => setCredit(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Provide proper attribution to avoid copyright issues
              </p>
            </div>

            {/* Copyright Guidelines */}
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

            {/* Insert Button */}
            <Button
              type="button"
              onClick={handleInsert}
              className="w-full"
              disabled={!imageUrl || !altText || !credit}
            >
              Insert Image with Credit
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadDialog;
