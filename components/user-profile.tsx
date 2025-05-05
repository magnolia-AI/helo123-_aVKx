'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type User = {
  id: string;
  name: string;
  image?: string | null;
  bio?: string | null;
  followedBy: any[];
  following: any[];
};

type UserProfileProps = {
  user: User;
  currentUserId?: string;
  onFollowToggled?: () => void;
};

export function UserProfile({ user, currentUserId, onFollowToggled }: UserProfileProps) {
  const [isFollowing, setIsFollowing] = useState(
    user.followedBy?.some(follow => follow.followerId === currentUserId) || false
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const followersCount = user.followedBy?.length || 0;
  const followingCount = user.following?.length || 0;
  const isCurrentUser = currentUserId === user.id;

  const handleFollowToggle = async () => {
    if (!currentUserId) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to follow users',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          followerId: currentUserId,
          followingId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle follow');
      }

      setIsFollowing(!isFollowing);
      
      if (onFollowToggled) {
        onFollowToggled();
      }

      toast({
        title: isFollowing ? 'Unfollowed' : 'Following',
        description: isFollowing 
          ? `You unfollowed ${user.name}` 
          : `You are now following ${user.name}`,
      });
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        title: 'Error',
        description: 'Failed to follow user. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-4">
            {user.image && (
              <img 
                src={user.image} 
                alt={user.name} 
                className="aspect-square h-full w-full"
              />
            )}
          </Avatar>
          <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
          {user.bio && (
            <p className="text-muted-foreground mb-4 max-w-md">{user.bio}</p>
          )}
          
          <div className="flex space-x-6 mb-6">
            <div className="text-center">
              <div className="font-semibold">{followersCount}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">{followingCount}</div>
              <div className="text-sm text-muted-foreground">Following</div>
            </div>
          </div>
          
          {!isCurrentUser && currentUserId && (
            <Button 
              onClick={handleFollowToggle}
              disabled={isSubmitting}
              variant={isFollowing ? "outline" : "default"}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
