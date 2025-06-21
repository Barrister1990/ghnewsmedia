
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ImagePreviewProps {
  imageUrl: string;
  onRemove: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl, onRemove }) => {
  const getImageUrl = (url: string) => {
    // Handle placeholder images
    if (url.startsWith('photo-')) {
      return `https://images.unsplash.com/${url}?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80`;
    }
    return url;
  };

  const handleRemove = async () => {
    if (imageUrl && imageUrl.includes('article-images')) {
      // If it's a Supabase storage URL, try to delete it
      try {
        const url = new URL(imageUrl);
        const pathParts = url.pathname.split('/');
        const fileName = pathParts[pathParts.length - 1];
        
        // Find the file path in storage
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const filePath = `${user.id}/${fileName}`;
          
          const { error } = await supabase.storage
            .from('article-images')
            .remove([filePath]);
            
          if (error) {
            console.error('Error deleting file:', error);
          }
        }
      } catch (error) {
        console.error('Error parsing URL for deletion:', error);
      }
    }
    
    onRemove();
    toast.success('Image removed');
  };

  return (
    <div className="relative group">
      <img
        src={getImageUrl(imageUrl)}
        alt="Featured image"
        className="w-full h-48 object-cover rounded-lg border"
        onError={(e) => {
          e.currentTarget.src = 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => window.open(getImageUrl(imageUrl), '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
