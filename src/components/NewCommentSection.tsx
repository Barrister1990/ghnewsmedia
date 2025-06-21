
import React, { useState } from 'react';
import { User, Send, Heart, Reply, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useArticleComments } from '@/hooks/useArticleComments';

interface NewCommentSectionProps {
  articleId: string;
}

const NewCommentSection: React.FC<NewCommentSectionProps> = ({ articleId }) => {
  const { comments, loading, addComment } = useArticleComments(articleId);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyAuthorName, setReplyAuthorName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim() || submitting) {
      return;
    }

    setSubmitting(true);
    await addComment(newComment, authorName);
    setNewComment('');
    setAuthorName('');
    setSubmitting(false);
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim() || !replyAuthorName.trim() || submitting) {
      return;
    }

    setSubmitting(true);
    await addComment(replyContent, replyAuthorName, parentId);
    setReplyContent('');
    setReplyAuthorName('');
    setReplyTo(null);
    setSubmitting(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const topLevelComments = comments.filter(comment => !comment.parent_id);
  const getReplies = (parentId: string) => comments.filter(comment => comment.parent_id === parentId);

  if (loading && comments.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="space-y-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <div className="flex items-center mb-6">
        <MessageCircle className="w-5 h-5 mr-2 text-gray-700" />
        <h3 className="text-xl font-bold text-gray-900">
          Comments ({topLevelComments.length})
        </h3>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Your name"
              className="w-full"
              required
              disabled={submitting}
            />
          </div>
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            rows={4}
            className="w-full mb-3"
            required
            disabled={submitting}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!newComment.trim() || !authorName.trim() || submitting}
              className="flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Posting...' : 'Post Comment'}</span>
            </Button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {topLevelComments.length > 0 ? (
          topLevelComments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{comment.author_name}</h4>
                    <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-3">{comment.content}</p>
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                      <span>Like</span>
                    </button>
                    <button
                      onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                      className="flex items-center space-x-1 text-sm text-gray-500 hover:text-primary transition-colors"
                      disabled={submitting}
                    >
                      <Reply className="w-4 h-4" />
                      <span>Reply</span>
                      {comment.replies_count > 0 && (
                        <span className="ml-1 bg-gray-100 px-2 py-1 rounded-full text-xs">
                          {comment.replies_count}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Reply Form */}
              {replyTo === comment.id && (
                <div className="mt-4 ml-13">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <Input
                        value={replyAuthorName}
                        onChange={(e) => setReplyAuthorName(e.target.value)}
                        placeholder="Your name"
                        className="w-full"
                        required
                        disabled={submitting}
                      />
                    </div>
                    <Textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write a reply..."
                      rows={3}
                      className="w-full mb-3"
                      required
                      disabled={submitting}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setReplyTo(null)}
                        disabled={submitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleSubmitReply(comment.id)}
                        disabled={!replyContent.trim() || !replyAuthorName.trim() || submitting}
                      >
                        {submitting ? 'Replying...' : 'Reply'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Replies */}
              {getReplies(comment.id).map((reply) => (
                <div key={reply.id} className="ml-13 mt-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h5 className="font-medium text-gray-900">{reply.author_name}</h5>
                          <span className="text-xs text-gray-500">{formatDate(reply.created_at)}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{reply.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-4">💬</div>
            <p>Be the first to comment on this article!</p>
          </div>
        )}
      </div>

      {/* Loading indicator when fetching new comments */}
      {loading && comments.length > 0 && (
        <div className="text-center py-4">
          <div className="inline-flex items-center text-sm text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
            Updating comments...
          </div>
        </div>
      )}
    </div>
  );
};

export default NewCommentSection;
