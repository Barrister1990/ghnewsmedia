
import AdminLayout from '@/components/admin/AdminLayout';
import { AnimatedLoading } from '@/components/admin/AnimatedLoading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { uploadProfileAvatar } from '@/lib/supabase-storage';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Trash2, Upload, UserRound } from 'lucide-react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string(),
  bio: z.string(),
  twitter: z.string(),
  facebook: z.string(),
  linkedin: z.string(),
  avatar: z.string(),
  email_verified: z.boolean(),
  role: z.enum(['admin', 'editor', 'moderator', 'user']),
});

type FormValues = z.infer<typeof formSchema>;

const uuidRe =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const AdminUserDetail = () => {
  const router = useRouter();
  const rawId = router.query.id;
  const userId = typeof rawId === 'string' ? rawId : Array.isArray(rawId) ? rawId[0] : undefined;

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      title: '',
      bio: '',
      twitter: '',
      facebook: '',
      linkedin: '',
      avatar: '',
      email_verified: false,
      role: 'user',
    },
  });

  const loadUser = useCallback(async () => {
    if (!router.isReady) return;

    if (!userId || !uuidRe.test(userId)) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setNotFound(false);
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) {
        setNotFound(true);
        return;
      }

      const { data: roleRows, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .limit(1);

      if (roleError) throw roleError;

      const role = (roleRows?.[0]?.role as FormValues['role']) || 'user';

      form.reset({
        name: profile.name || '',
        title: profile.title || '',
        bio: profile.bio || '',
        twitter: profile.twitter || '',
        facebook: profile.facebook || '',
        linkedin: profile.linkedin || '',
        avatar: profile.avatar || '',
        email_verified: Boolean(profile.email_verified),
        role,
      });
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load user');
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [userId, router.isReady, form]);

  useEffect(() => {
    if (!router.isReady) return;
    loadUser();
  }, [router.isReady, loadUser]);

  const handleAvatarPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(URL.createObjectURL(file));
    e.target.value = '';
  };

  const handleRemoveAvatar = () => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(null);
    setAvatarPreview(null);
    form.setValue('avatar', '');
  };

  const trimOrNull = (v: string | undefined) => {
    const t = v?.trim();
    return t ? t : null;
  };

  const onSubmit = async (values: FormValues) => {
    if (!userId) return;
    setSaving(true);
    try {
      let avatarUrl = trimOrNull(values.avatar);
      if (avatarFile) {
        const up = await uploadProfileAvatar(userId, avatarFile);
        if (!up.success || !up.url) {
          toast.error(up.error || 'Avatar upload failed');
          setSaving(false);
          return;
        }
        avatarUrl = up.url;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: values.name.trim(),
          title: trimOrNull(values.title),
          bio: trimOrNull(values.bio),
          twitter: trimOrNull(values.twitter),
          facebook: trimOrNull(values.facebook),
          linkedin: trimOrNull(values.linkedin),
          avatar: avatarUrl,
          email_verified: values.email_verified,
        })
        .eq('id', userId);

      if (profileError) throw profileError;

      await supabase.from('user_roles').delete().eq('user_id', userId);
      const { error: roleInsertError } = await supabase.from('user_roles').insert({
        user_id: userId,
        role: values.role,
      });
      if (roleInsertError) throw roleInsertError;

      form.setValue('avatar', avatarUrl || '');
      setAvatarFile(null);
      setAvatarPreview(null);
      toast.success('User updated');
      router.push('/admin/users');
    } catch (e) {
      console.error(e);
      toast.error('Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  if (!router.isReady || (loading && !notFound)) {
    return (
      <AdminLayout>
        <AnimatedLoading />
      </AdminLayout>
    );
  }

  if (!userId || notFound || !uuidRe.test(userId)) {
    return (
      <AdminLayout>
        <div className="space-y-4">
          <Button variant="outline" size="sm" onClick={() => router.push('/admin/users')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
          <p className="text-gray-600">User not found or invalid id.</p>
        </div>
      </AdminLayout>
    );
  }

  const displayAvatar = avatarPreview || form.watch('avatar') || undefined;

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push('/admin/users')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User details</h1>
            <p className="text-gray-600 text-sm font-mono break-all">ID: {userId}</p>
            <p className="text-gray-500 text-sm mt-1">
              Auth email and password are managed in Supabase Authentication, not here.
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile & role</CardTitle>
                <CardDescription>Edit public profile fields and platform role.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="space-y-2">
                    <FormLabel>Avatar</FormLabel>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-24 w-24 border">
                        <AvatarImage src={displayAvatar} alt={form.watch('name')} />
                        <AvatarFallback className="bg-muted">
                          <UserRound className="h-12 w-12 text-muted-foreground" strokeWidth={1.75} />
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => avatarInputRef.current?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload image
                          </Button>
                          {(avatarPreview ||
                            (form.watch('avatar') && form.watch('avatar').trim())) && (
                            <Button type="button" variant="outline" size="sm" onClick={handleRemoveAvatar}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove photo
                            </Button>
                          )}
                        </div>
                        <input
                          ref={avatarInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          className="hidden"
                          onChange={handleAvatarPick}
                        />
                        <p className="text-xs text-gray-500">Stored in the avatars bucket (max 5MB).</p>
                      </div>
                    </div>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avatar URL (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://…" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormDescription>
                        Override or paste an external URL. Clear the field or use Remove photo so their profile shows the default icon on the site.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ''} placeholder="Job title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea rows={4} {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ''} placeholder="URL or handle" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ''} placeholder="URL" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ''} placeholder="URL" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email_verified"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Email verified (profile flag)</FormLabel>
                        <FormDescription>
                          Mirrors the profiles column; does not change Supabase Auth confirmation by itself.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.push('/admin/users')}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving…' : 'Save changes'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
};

export default AdminUserDetail;
