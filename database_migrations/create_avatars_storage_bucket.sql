-- Migration: Create `avatars` storage bucket and RLS policies
-- Run in Supabase SQL editor or via `supabase db push` after linking the project.
-- Aligns with app usage: bucket id `avatars`, object paths like `avatars/{userId}-{random}.{ext}`
-- (see `uploadProfileAvatar` in src/lib/supabase-storage.ts and CMS profile uploads).

-- 1) Bucket (public URLs for profile images on the site)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2) Policies on storage.objects (idempotent names)

-- Anyone can read objects in this bucket (public avatars)
DROP POLICY IF EXISTS "Avatars public read" ON storage.objects;
CREATE POLICY "Avatars public read"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'avatars');

-- Helper expression: filename segment after `avatars/` prefix must be `{owner_uuid}-…`
-- split_part(name, '/', 2) is the object key under the logical `avatars/` folder in the bucket.

DROP POLICY IF EXISTS "Avatars insert own or admin" ON storage.objects;
CREATE POLICY "Avatars insert own or admin"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (
      EXISTS (
        SELECT 1
        FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
          AND ur.role = 'admin'
      )
      OR split_part(name, '/', 2) LIKE (auth.uid())::text || '-%'
    )
  );

DROP POLICY IF EXISTS "Avatars update own or admin" ON storage.objects;
CREATE POLICY "Avatars update own or admin"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (
      EXISTS (
        SELECT 1
        FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
          AND ur.role = 'admin'
      )
      OR split_part(name, '/', 2) LIKE (auth.uid())::text || '-%'
    )
  )
  WITH CHECK (
    bucket_id = 'avatars'
    AND (
      EXISTS (
        SELECT 1
        FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
          AND ur.role = 'admin'
      )
      OR split_part(name, '/', 2) LIKE (auth.uid())::text || '-%'
    )
  );

DROP POLICY IF EXISTS "Avatars delete own or admin" ON storage.objects;
CREATE POLICY "Avatars delete own or admin"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (
      EXISTS (
        SELECT 1
        FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
          AND ur.role = 'admin'
      )
      OR split_part(name, '/', 2) LIKE (auth.uid())::text || '-%'
    )
  );
