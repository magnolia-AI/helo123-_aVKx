import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { followerId, followingId } = await request.json();

    if (!followerId || !followingId) {
      return NextResponse.json(
        { error: 'FollowerId and followingId are required' },
        { status: 400 }
      );
    }

    // Check if follow relationship already exists
    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (existingFollow) {
      // If follow exists, remove it (unfollow)
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      });

      return NextResponse.json({ message: 'Unfollowed successfully' });
    } else {
      // If follow doesn't exist, create it
      const follow = await prisma.follows.create({
        data: {
          followerId,
          followingId,
        },
      });

      return NextResponse.json(follow, { status: 201 });
    }
  } catch (error) {
    console.error('Error toggling follow:', error);
    return NextResponse.json(
      { error: 'Failed to toggle follow' },
      { status: 500 }
    );
  }
}
