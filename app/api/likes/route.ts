import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId, postId } = await request.json();

    if (!userId || !postId) {
      return NextResponse.json(
        { error: 'UserId and postId are required' },
        { status: 400 }
      );
    }

    // Check if like already exists
    const existingLike = await prisma.like.findFirst({
      where: {
        userId,
        postId,
      },
    });

    if (existingLike) {
      // If like exists, remove it (unlike)
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });

      return NextResponse.json({ message: 'Post unliked successfully' });
    } else {
      // If like doesn't exist, create it
      const like = await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });

      return NextResponse.json(like, { status: 201 });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}
