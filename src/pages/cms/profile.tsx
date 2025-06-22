import { AnimatedLoading } from '@/components/admin/AnimatedLoading';
import CMSLayout from '@/components/cms/CMSLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Save, Upload, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Profile {
  name: string;
  avatar: string | null;
  email?: string;
}

const CMSProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile>({
    name: '',
    avatar: null,
    email: user?.email || ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    // Add guard clause to ensure user and user.id exist
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, avatar')
        .eq('id', user.id) // Now TypeScript knows user.id is defined
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(prev => ({
          ...prev,
          name: data.name || '',
          avatar: data.avatar
        }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!user?.id) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setSaving(true);
    try {
      let avatarUrl = profile.avatar;

      // Upload new avatar if selected
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar(avatarFile);
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        }
      }

      // Update profile
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: profile.name,
          avatar: avatarUrl
        });

      if (error) throw error;

      setProfile(prev => ({ ...prev, avatar: avatarUrl }));
      setAvatarFile(null);
      setAvatarPreview(null);
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
        <CMSLayout>
       <AnimatedLoading />
      </CMSLayout>
    );
  }

  return (
    <CMSLayout>
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600">Manage your personal information and preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your name and profile picture
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture Section */}
            <div className="space-y-4">
              <Label>Profile Picture</Label>
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage 
                    src={avatarPreview || profile.avatar || undefined} 
                    alt={profile.name} 
                  />
                  <AvatarFallback className="text-xl">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : <User className="h-8 w-8" />}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    JPG, PNG up to 10MB
                  </p>
                </div>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>

            <Separator />

            {/* Name Section */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email Section (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                value={profile.email}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">
                Email cannot be changed from this interface
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2">
          <Button
            type="submit"
            disabled={isSaving}
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </Button>
        </div>
      </form>
    </div>
    </CMSLayout>
  );
};

export default CMSProfile;