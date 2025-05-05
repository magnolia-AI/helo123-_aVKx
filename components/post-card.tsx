'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share2, MoreHorizontal, Trash2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

type User = {
  id: string;
  name: string;
  image?: string | null;
};

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  author: User;
};

type Like = {
  id: string;
  userId: string;
};

type Post = {
  id: string;
  content: string;
  image?: string | null;
  createdAt: string;
  author: User;
  comments: Comment[];
  likes: Like[];
};

type PostCardProps = {
  post: Post;
  currentUserId?: string;
  onPostDeleted?: () => void;
  onCommentAdded?: (postId: string, comment: Comment) => void;
  onLikeToggled?: (postId: string, liked: boolean) => void;
};

export function PostCard({ post, currentUserId, onPostDeleted, onCommentAdded, onLikeToggled }: PostCardProps) {
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const isLiked = currentUserId ? post.likes.some(like => like.userId === currentUserId) : false;
  const likeCount = post.likes.length;
  const commentCount = post.comments.length;
  const isAuthor = currentUserId === post.author.id;

  const handleLike = async () => {
    if (!currentUserId) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to like posts',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
          postId: post.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }

      if (onLikeToggled) {
        onLikeToggled(post.id, !isLiked);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: 'Error',
        description: 'Failed to like post. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    if (!currentUserId) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to comment',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: commentText,
          authorId: currentUserId,
          postId: post.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const newComment = await response.json();
      setCommentText('');
      setIsCommenting(false);

      if (onCommentAdded) {
        onCommentAdded(post.id, newComment);
      }

      toast({
        title: 'Comment added',
        description: 'Your comment was added successfully',
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to add comment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    if (!isAuthor) return;

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      if (onPostDeleted) {
        onPostDeleted();
      }

      toast({
        title: 'Post deleted',
        description: 'Your post was deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete post. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              {post.author.image && (
                <img 
                  src={post.author.image} 
                  alt={post.author.name} 
                  className="aspect-square h-full w-full"
                />
              )}
            </Avatar>
            <div>
              <div className="font-semibold">{post.author.name}</div>
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </div>
            </div>
          </div>
          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDeletePost} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap">{post.content}</p>
        {post.image && (
          <div className="mt-3 rounded-md overflow-hidden">
            <img 
              src={post.image} 
              alt="Post image" 
              className="w-full object-cover max-h-[500px]" 
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start pt-0">
        <div className="flex items-center justify-between w-full mb-2">
          <div className="text-sm text-muted-foreground">
            {likeCount} {likeCount === 1 ? 'like' : 'likes'} · {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
          </div>
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" onClick={handleLike}>
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsCommenting(!isCommenting)}>
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isCommenting && (
          <div className="w-full mt-2">
            <Textarea
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="mb-2"
            />
            <Button 
              onClick={handleComment} 
              disabled={!commentText.trim() || isSubmitting}
              size="sm"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        )}

        {post.comments.length > 0 && (
          <div className="w-full mt-4">
            <Separator className="mb-4" />
            <div className="space-y-4">
              {post.comments.slice(0, 3).map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <Avatar className="h-8 w-8">
                    {comment.author.image && (
                      <img 
                        src={comment.author.image} 
                        alt={comment.author.name} 
                        className="aspect-square h-full w-full"
                      />
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted rounded-md p-3">
                      <div className="font-semibold text-sm">{comment.author.name}</div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              ))}
              {post.comments.length > 3 && (
                <Button variant="link" className="px-0" onClick={() => setIsCommenting(true)}>
                  View all {post.comments.length} comments
                </Button>
              )}
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
