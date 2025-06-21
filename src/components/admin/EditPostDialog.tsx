
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const formSchema = z.object({
  account_id: z.string().min(1, 'Account is required'),
  content: z.string().min(1, 'Content is required'),
  engagement: z.string().optional(),
  posted_at: z.string().min(1, 'Posted date is required'),
});

interface SocialMediaPost {
  id: string;
  content: string;
  engagement: string | null;
  posted_at: string;
  account_id: string;
}

interface SocialMediaAccount {
  id: string;
  platform: string;
  handle: string;
  followers_count: number;
}

interface EditPostDialogProps {
  post: SocialMediaPost | null;
  accounts: SocialMediaAccount[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditPostDialog = ({ post, accounts, open, onOpenChange, onSuccess }: EditPostDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      account_id: '',
      content: '',
      engagement: '',
      posted_at: '',
    },
  });

  useEffect(() => {
    if (post) {
      form.reset({
        account_id: post.account_id,
        content: post.content,
        engagement: post.engagement || '',
        posted_at: new Date(post.posted_at).toISOString().slice(0, 16),
      });
    }
  }, [post, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!post) return;

    try {
      const { error } = await supabase
        .from('social_media_posts')
        .update({
          ...values,
          posted_at: new Date(values.posted_at).toISOString(),
        })
        .eq('id', post.id);

      if (error) throw error;

      toast.success('Post updated successfully');
      onSuccess();
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Social Media Post</DialogTitle>
          <DialogDescription>
            Update the social media post information.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="account_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an account" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.platform} - {account.handle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter the post content..." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="engagement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Engagement (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 250 likes, 45 comments" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="posted_at"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Posted Date & Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Post</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPostDialog;
