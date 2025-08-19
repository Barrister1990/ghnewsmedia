# Supabase Storage Setup for Article Images

This document explains how to set up the Supabase storage bucket for article images in the GH News Media application.

## Prerequisites

- Supabase project with storage enabled
- Proper authentication and RLS policies configured

## Storage Bucket Configuration

### 1. Create the Storage Bucket

The application will automatically attempt to create the `article-images` bucket if it doesn't exist. However, you may need to manually configure it in the Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **Create a new bucket**
4. Set the following configuration:
   - **Name**: `article-images`
   - **Public bucket**: ✅ Enabled
   - **File size limit**: 5MB
   - **Allowed MIME types**: 
     - `image/jpeg`
     - `image/jpg`
     - `image/png`
     - `image/gif`
     - `image/webp`

### 2. Configure RLS Policies

Create the following RLS policies for the `article-images` bucket:

#### Policy 1: Allow public read access
```sql
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'article-images');
```

#### Policy 2: Allow authenticated users to upload
```sql
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'article-images' 
  AND auth.role() = 'authenticated'
);
```

#### Policy 3: Allow users to update their own uploads
```sql
CREATE POLICY "Users can update own uploads" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'article-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Policy 4: Allow users to delete their own uploads
```sql
CREATE POLICY "Users can delete own uploads" ON storage.objects
FOR DELETE USING (
  bucket_id = 'article-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### 3. Bucket Structure

The storage bucket will organize images as follows:

```
article-images/
├── featured/          # Featured article images
│   ├── 1234567890-abc123.jpg
│   └── 1234567891-def456.png
└── inline/            # Inline article images
    ├── 1234567892-ghi789.gif
    └── 1234567893-jkl012.webp
```

## Environment Variables

Ensure your Supabase environment variables are properly configured in your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Usage

The storage functionality is implemented through the `ImageUpload` component and utility functions:

### Components
- `ImageUpload`: React component for uploading images with drag-and-drop support
- `src/components/admin/ImageUpload.tsx`

### Utility Functions
- `uploadArticleImage()`: Uploads an image to the storage bucket
- `deleteArticleImage()`: Deletes an image from the storage bucket
- `listArticleImages()`: Lists all images in the bucket
- `ensureArticleImagesBucket()`: Ensures the bucket exists

### Example Usage

```tsx
import { ImageUpload } from '@/components/admin/ImageUpload';

<ImageUpload
  value={imageUrl}
  onChange={setImageUrl}
  onImageUpload={(url, credit) => {
    console.log('Image uploaded:', url, credit);
  }}
  type="featured"
  required={true}
/>
```

## File Validation

The system automatically validates:
- **File types**: Only JPEG, PNG, GIF, and WebP are allowed
- **File size**: Maximum 5MB per file
- **File naming**: Unique timestamps and random strings prevent conflicts

## Error Handling

Common error scenarios and solutions:

1. **Bucket not found**: The utility will attempt to create it automatically
2. **Permission denied**: Check RLS policies and user authentication
3. **File too large**: Ensure files are under 5MB
4. **Invalid file type**: Only image files are accepted

## Security Considerations

- Images are stored in a public bucket for easy access
- RLS policies control who can upload/delete
- File validation prevents malicious uploads
- Unique file naming prevents conflicts and overwrites

## Troubleshooting

### Common Issues

1. **"Failed to create or access storage bucket"**
   - Check Supabase project permissions
   - Verify storage is enabled in your project

2. **"Permission denied" errors**
   - Review RLS policies
   - Ensure user is authenticated

3. **Upload failures**
   - Check file size and type
   - Verify network connectivity
   - Review browser console for errors

### Debug Mode

Enable debug logging by checking the browser console for detailed error messages from the storage utility functions.

## Support

If you encounter issues with the storage setup, check:
1. Supabase project dashboard for storage configuration
2. Browser console for error messages
3. Network tab for failed requests
4. RLS policy configuration
