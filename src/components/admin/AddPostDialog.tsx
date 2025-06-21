
import React from 'react';
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

interface SocialMediaAccount {
  id: string;
  platform: string;
  handle: string;
  followers_count: number;
}

interface AddPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accounts: SocialMediaAccount[];
  onSuccess: () => void;
}

const AddPostDialog = ({ open, onOpenChange, accounts, onSuccess }: AddPostDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      account_id: '',
      content: '',
      engagement: '',
      posted_at: new Date().toISOString().slice(0, 16),
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const postData = {
        account_id: values.account_id,
        content: values.content,
        engagement: values.engagement || null,
        posted_at: new Date(values.posted_at).toISOString(),
      };

      const { error } = await supabase
        .from('social_media_posts')
        .insert(postData);

      if (error) throw error;

      toast.success('Post added successfully');
      form.reset();
      onSuccess();
    } catch (error) {
      console.error('Error adding post:', error);
      toast.error('Failed to add post');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add Social Media Post</DialogTitle>
          <DialogDescription>
            Add a new social media post to track engagement.
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <Button type="submit">Add Post</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPostDialog;
