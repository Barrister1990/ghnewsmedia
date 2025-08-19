import { supabase } from '@/integrations/supabase/client';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  path?: string;
}

/**
 * Uploads an image to the article-images bucket
 */
export const uploadArticleImage = async (
  file: File,
  type: 'featured' | 'inline' = 'featured'
): Promise<UploadResult> => {
  try {
    // Validate file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'
      };
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File size too large. Maximum size is 5MB.'
      };
    }

    // Generate unique filename without subfolder structure
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
    
    // Upload file directly to the root of the bucket (no subfolders)
    const { data, error } = await supabase.storage
      .from('article-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('article-images')
      .getPublicUrl(fileName);

    return {
      success: true,
      url: publicUrl,
      path: fileName
    };

  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during upload'
    };
  }
};

/**
 * Deletes an image from the article-images bucket
 */
export const deleteArticleImage = async (filePath: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from('article-images')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting file:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

/**
 * Lists all images in the article-images bucket
 */
export const listArticleImages = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase.storage
      .from('article-images')
      .list('', {
        limit: 100,
        offset: 0
      });

    if (error) {
      console.error('Error listing files:', error);
      return [];
    }

    return data?.map(file => file.name) || [];
  } catch (error) {
    console.error('Error listing files:', error);
    return [];
  }
};
