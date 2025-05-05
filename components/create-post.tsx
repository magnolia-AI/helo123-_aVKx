'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ImagePlus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type User = {
  id: string;
  name: string;
  image?: string | null;
};

type CreatePostProps = {
  currentUser: User;
  onPostCreated: () => void;
};

export function CreatePost({ currentUser, onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          image: imageUrl || undefined,
          authorId: currentUser.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      setContent('');
      setImageUrl('');
      setShowImageInput(false);
      onPostCreated();

      toast({
        title: 'Success',
        description: 'Your post was created successfully',
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex space-x-3">
          <Avatar className="h-10 w-10">
            {currentUser.image && (
              <img 
                src={currentUser.image} 
                alt={currentUser.name} 
                className="aspect-square h-full w-full"
              />
            )}
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder={`What's on your mind, ${currentUser.name.split(' ')[0]}?`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
            />
            {showImageInput && (
              <div className="mt-3 relative">
                <input
                  type="text"
                  placeholder="Enter image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-2 pr-8 text-sm border rounded-md"
                />
                <button
                  onClick={() => {
                    setImageUrl('');
                    setShowImageInput(false);
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            {imageUrl && (
              <div className="mt-3 relative rounded-md overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt="Preview" 
                  className="w-full max-h-[300px] object-cover" 
                />
                <button
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 bg-black/70 rounded-full p-1 text-white hover:bg-black/90"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between border-t pt-3 px-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowImageInput(!showImageInput)}
        >
          <ImagePlus className="h-4 w-4 mr-2" />
          Add Image
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting}
          size="sm"
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </Button>
      </CardFooter>
    </Card>
  );
}
