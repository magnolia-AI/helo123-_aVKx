'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from "@/hooks/use-toast"
import { PostCard } from '@/components/post-card'
import { UserProfile } from '@/components/user-profile'

// Mock current user (in a real app, this would come from authentication)
const MOCK_CURRENT_USER = {
  id: "user1",
  name: "John Doe",
  image: "https://randomuser.me/api/portraits/men/1.jpg"
}

export default function ProfilePage() {
  const params = useParams()
  const userId = params.id as string
  const { toast } = useToast()
  
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUserProfile = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/users/${userId}`)
      if (!response.ok) throw new Error('Failed to fetch user profile')
      const data = await response.json()
      setUser(data)
    } catch (error) {
      console.error('Error fetching user profile:', error)
      toast({
        title: "Error",
        description: "Failed to load user profile. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchUserProfile()
    }
  }, [userId])

  const handleFollowToggled = () => {
    fetchUserProfile()
  }

  const handlePostDeleted = () => {
    fetchUserProfile()
  }

  const handleCommentAdded = (postId: string, newComment: any) => {
    setUser(prevUser => {
      if (!prevUser) return prevUser
      
      const updatedPosts = prevUser.posts.map(post => 
        post.id === postId 
          ? { ...post, comments: [newComment, ...post.comments] }
          : post
      )
      
      return { ...prevUser, posts: updatedPosts }
    })
  }

  const handleLikeToggled = (postId: string, liked: boolean) => {
    setUser(prevUser => {
      if (!prevUser) return prevUser
      
      const updatedPosts = prevUser.posts.map(post => {
        if (post.id !== postId) return post
        
        const updatedLikes = liked
          ? [...post.likes, { id: 'temp-id', userId: MOCK_CURRENT_USER.id }]
          : post.likes.filter(like => like.userId !== MOCK_CURRENT_USER.id)
        
        return { ...post, likes: updatedLikes }
      })
      
      return { ...prevUser, posts: updatedPosts }
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="animate-pulse">
          <div className="rounded-lg bg-muted h-[300px] mb-6"></div>
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="h-[200px] bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl text-center">
        <h1 className="text-2xl font-bold mb-4">User not found</h1>
        <p className="text-muted-foreground mb-6">The user you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <UserProfile 
        user={user} 
        currentUserId={MOCK_CURRENT_USER.id}
        onFollowToggled={handleFollowToggled}
      />
      
      <Tabs defaultValue="posts" className="mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="mt-6">
          {user.posts.length > 0 ? (
            <div className="space-y-6">
              {user.posts.map(post => (
                <PostCard 
                  key={post.id}
                  post={post}
                  currentUserId={MOCK_CURRENT_USER.id}
                  onPostDeleted={handlePostDeleted}
                  onCommentAdded={handleCommentAdded}
                  onLikeToggled={handleLikeToggled}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                <p className="text-muted-foreground">
                  {user.id === MOCK_CURRENT_USER.id 
                    ? "You haven't created any posts yet." 
                    : `${user.name} hasn't created any posts yet.`}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="about" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">About {user.name}</h3>
              
              {user.bio ? (
                <p className="text-muted-foreground whitespace-pre-wrap">{user.bio}</p>
              ) : (
                <p className="text-muted-foreground italic">
                  {user.id === MOCK_CURRENT_USER.id 
                    ? "You haven't added a bio yet." 
                    : `${user.name} hasn't added a bio yet.`}
                </p>
              )}
              
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold mb-2">Joined</h4>
                <p className="text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
