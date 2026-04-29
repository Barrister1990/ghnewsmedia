
import AdminLayout from '@/components/admin/AdminLayout';
import { AnimatedLoading } from '@/components/admin/AnimatedLoading';
import { ADMIN_PANEL_CARD, AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { CheckCircle, Trash2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Comment {
  id: string;
  content: string;
  author_name: string;
  approved: boolean;
  created_at: string;
  article_id: string;
  articles?: {
    title: string;
  };
}

const CommentsManagement = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          articles(title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ approved: true })
        .eq('id', commentId);

      if (error) throw error;
      toast.success('Comment approved');
      fetchComments();
    } catch (error) {
      console.error('Error approving comment:', error);
      toast.error('Failed to approve comment');
    }
  };

  const handleReject = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ approved: false })
        .eq('id', commentId);

      if (error) throw error;
      toast.success('Comment rejected');
      fetchComments();
    } catch (error) {
      console.error('Error rejecting comment:', error);
      toast.error('Failed to reject comment');
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
      toast.success('Comment deleted');
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const filteredComments = comments.filter(comment => {
    if (filter === 'approved') return comment.approved;
    if (filter === 'pending') return !comment.approved;
    return true;
  });

  if (loading) {
    return (
      <AdminLayout>
        <AnimatedLoading />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
    <div className="space-y-8 pb-4">
      <AdminPageHeader
        title="Comments"
        description="Review, approve, or remove comments attached to stories."
        actions={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              className={cn(filter !== 'all' && 'border-stone-200 bg-white')}
              onClick={() => setFilter('all')}
            >
              All ({comments.length})
            </Button>
            <Button
              variant={filter === 'approved' ? 'default' : 'outline'}
              className={cn(filter !== 'approved' && 'border-stone-200 bg-white')}
              onClick={() => setFilter('approved')}
            >
              Approved ({comments.filter(c => c.approved).length})
            </Button>
            <Button
              variant={filter === 'pending' ? 'default' : 'outline'}
              className={cn(filter !== 'pending' && 'border-stone-200 bg-white')}
              onClick={() => setFilter('pending')}
            >
              Pending ({comments.filter(c => !c.approved).length})
            </Button>
          </div>
        }
      />

      <Card className={cn(ADMIN_PANEL_CARD)}>
        <CardHeader>
          <CardTitle className="text-lg">Queue ({filteredComments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Author</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Article</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell className="font-medium">
                    {comment.author_name}
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="truncate">{comment.content}</p>
                  </TableCell>
                  <TableCell>
                    {comment.articles?.title || 'Unknown Article'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={comment.approved ? 'default' : 'secondary'}>
                      {comment.approved ? 'Approved' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(comment.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {!comment.approved && (
                        <Button
                          size="sm"
                          onClick={() => handleApprove(comment.id)}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      {comment.approved && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(comment.id)}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(comment.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    </AdminLayout>
  );
};

export default CommentsManagement;
