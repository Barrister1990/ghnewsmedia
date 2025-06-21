
import React, { useState } from 'react';
import { Edit, Trash2, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import EditPostDialog from './EditPostDialog';

interface SocialMediaPost {
  id: string;
  content: string;
  engagement: string | null;
  posted_at: string;
  account_id: string;
  account: {
    platform: string;
  };
}

interface SocialMediaAccount {
  id: string;
  platform: string;
  handle: string;
  followers_count: number;
}

interface SocialMediaPostsTableProps {
  posts: SocialMediaPost[];
  accounts: SocialMediaAccount[];
  onRefresh: () => void;
}

const SocialMediaPostsTable = ({ posts, accounts, onRefresh }: SocialMediaPostsTableProps) => {
  const [editingPost, setEditingPost] = useState<SocialMediaPost | null>(null);

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return Facebook;
      case 'twitter': return Twitter;
      case 'instagram': return Instagram;
      case 'youtube': return Youtube;
      default: return Twitter;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('social_media_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Post deleted successfully');
      onRefresh();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-gray-500">No social media posts found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Social Media Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Platform</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead>Posted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => {
                const Icon = getPlatformIcon(post.account?.platform || 'twitter');
                return (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4" />
                        <span>{post.account?.platform || 'Unknown'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={post.content}>
                        {post.content}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500">
                        {post.engagement || 'No data'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDistanceToNow(new Date(post.posted_at), { addSuffix: true })}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingPost(post)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Post</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this social media post? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(post.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EditPostDialog
        post={editingPost}
        accounts={accounts}
        open={!!editingPost}
        onOpenChange={(open) => !open && setEditingPost(null)}
        onSuccess={() => {
          setEditingPost(null);
          onRefresh();
        }}
      />
    </>
  );
};

export default SocialMediaPostsTable;
