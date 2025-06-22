
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Link, Upload } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface ImageUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImageInsert: (imageUrl: string, altText: string) => void;
}

const ImageUploadDialog: React.FC<ImageUploadDialogProps> = ({
  isOpen,
  onClose,
  onImageInsert
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [altText, setAltText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUrlInput('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    
    try {
      // Get the current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast.error('You must be logged in to upload images');
        return;
      }

      // Create a unique filename with user ID folder structure
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('article-images')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload image: ' + error.message);
        return;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('article-images')
        .getPublicUrl(data.path);

      const imageUrl = urlData.publicUrl;
      onImageInsert(imageUrl, altText || selectedFile.name);
      toast.success('Image uploaded successfully');
      handleClose();
      
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlInsert = () => {
    if (!urlInput.trim()) {
      toast.error('Please enter a valid image URL');
      return;
    }

    onImageInsert(urlInput.trim(), altText || 'Image');
    toast.success('Image URL inserted');
    handleClose();
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setUrlInput('');
    setAltText('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Alt Text Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Alt Text</label>
            <Input
              placeholder="Describe the image..."
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
            />
          </div>

          {/* Preview */}
          {(previewUrl || urlInput) && (
            <div className="border rounded-lg p-2">
              <img
                src={previewUrl || urlInput}
                alt="Preview"
                className="w-full h-32 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
                }}
              />
            </div>
          )}

          {/* Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-3">Upload an image</p>
            
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="image-upload"
            />
            
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('image-upload')?.click()}
              disabled={isUploading}
              className="w-full mb-2"
            >
              {selectedFile ? selectedFile.name : 'Choose File'}
            </Button>

            {selectedFile && (
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full"
              >
                {isUploading ? 'Uploading...' : 'Upload & Insert'}
              </Button>
            )}
          </div>

          {/* URL Section */}
          <div className="flex items-center text-xs text-gray-500">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-2">or</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          <div className="space-y-2">
            <Input
              type="url"
              placeholder="Enter image URL"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                setSelectedFile(null);
                setPreviewUrl('');
              }}
            />
            <Button
              onClick={handleUrlInsert}
              disabled={!urlInput.trim()}
              variant="outline"
              className="w-full"
            >
              <Link className="w-4 h-4 mr-2" />
              Insert URL
            </Button>
          </div>

          {/* Quick placeholder images */}
          <div className="text-xs text-gray-500">
            <p className="mb-1">Quick placeholder images:</p>
            <div className="flex flex-wrap gap-1">
              {[
                'photo-1649972904349-6e44c42644a7',
                'photo-1488590528505-98d2b5aba04b',
                'photo-1518770660439-4636190af475',
                'photo-1461749280684-dccba630e2f6'
              ].map((photo) => (
                <Button
                  key={photo}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs h-6 px-2"
                  onClick={() => {
                    const url = `https://images.unsplash.com/${photo}?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80`;
                    setUrlInput(url);
                    setSelectedFile(null);
                    setPreviewUrl('');
                  }}
                >
                  {photo.split('-')[1]}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadDialog;
