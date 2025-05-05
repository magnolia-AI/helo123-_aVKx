'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from "@/hooks/use-toast"
import { PostCard } from '@/components/post-card'
import { CreatePost } from '@/components/create-post'

// Mock current user (in a real app, this would come from authentication)
const MOCK_CURRENT_USER = {
  id: "user1",
  name: "John Doe",
  image: "https://randomuser.me/api/portraits/men/1.jpg"
}

export default function Home() {
  const { toast } = useToast()
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchPosts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/posts')
      if (!response.ok) throw new Error('Failed to fetch posts')
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
      toast({
        title: "Error",
        description: "Failed to load posts. Please refresh the page.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handlePostCreated = () => {
    fetchPosts()
  }

  const handlePostDeleted = () => {
    fetchPosts()
  }

  const handleCommentAdded = (postId: string, newComment: any) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, comments: [newComment, ...post.comments] }
          : post
      )
    )
  }

  const handleLikeToggled = (postId: string, liked: boolean) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id !== postId) return post
        
        const updatedLikes = liked
          ? [...post.likes, { id: 'temp-id', userId: MOCK_CURRENT_USER.id }]
          : post.likes.filter(like => like.userId !== MOCK_CURRENT_USER.id)
        
        return { ...post, likes: updatedLikes }
      })
    )
  }

  return (
    <div className="min-h-full">
      <section className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Social Feed</h1>
        
        <CreatePost 
          currentUser={MOCK_CURRENT_USER}
          onPostCreated={handlePostCreated}
        />

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardContent className="p-6 flex items-center justify-center h-[200px]">
                  <div className="animate-pulse flex space-x-4 w-full">
                    <div className="rounded-full bg-muted h-12 w-12"></div>
                    <div className="flex-1 space-y-4 py-1">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded"></div>
                        <div className="h-4 bg-muted rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div>
            {posts.map(post => (
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
              <p className="text-muted-foreground mb-4">Be the first to share something with the community!</p>
              <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Create a Post</Button>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  )
}
