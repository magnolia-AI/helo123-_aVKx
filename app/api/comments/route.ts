import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { content, authorId, postId } = await request.json();

    if (!content || !authorId || !postId) {
      return NextResponse.json(
        { error: 'Content, authorId, and postId are required' },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        authorId,
        postId,
      },
      include: {
        author: true,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
