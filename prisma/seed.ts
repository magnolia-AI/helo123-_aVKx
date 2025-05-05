import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Delete all existing data
  await prisma.follows.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      bio: 'Software developer and tech enthusiast',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
      bio: 'Digital artist and designer',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: 'Mike Johnson',
      email: 'mike@example.com',
      image: 'https://randomuser.me/api/portraits/men/3.jpg',
      bio: 'Travel photographer and adventurer',
    },
  });

  // Create posts
  const post1 = await prisma.post.create({
    data: {
      content: 'Just launched my new website! Check it out and let me know what you think.',
      authorId: user1.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      content: 'Beautiful sunset at the beach today. Nature is amazing! 🌅',
      image: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=800&auto=format&fit=crop',
      authorId: user2.id,
    },
  });

  const post3 = await prisma.post.create({
    data: {
      content: 'Just finished reading an amazing book on artificial intelligence. Highly recommend!',
      authorId: user3.id,
    },
  });

  // Create comments
  await prisma.comment.create({
    data: {
      content: 'Looks great! Congrats on the launch.',
      authorId: user2.id,
      postId: post1.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Wow, that view is breathtaking!',
      authorId: user1.id,
      postId: post2.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: "What was the name of the book? I'd like to read it too.",
      authorId: user2.id,
      postId: post3.id,
    },
  });

  // Create likes
  await prisma.like.create({
    data: {
      userId: user2.id,
      postId: post1.id,
    },
  });

  await prisma.like.create({
    data: {
      userId: user3.id,
      postId: post1.id,
    },
  });

  await prisma.like.create({
    data: {
      userId: user1.id,
      postId: post2.id,
    },
  });

  await prisma.like.create({
    data: {
      userId: user3.id,
      postId: post2.id,
    },
  });

  // Create follows
  await prisma.follows.create({
    data: {
      followerId: user1.id,
      followingId: user2.id,
    },
  });

  await prisma.follows.create({
    data: {
      followerId: user1.id,
      followingId: user3.id,
    },
  });

  await prisma.follows.create({
    data: {
      followerId: user2.id,
      followingId: user3.id,
    },
  });

  console.log('Database has been seeded!');
}

main()
  .then(async () => {
    await prisma.();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.();
    process.exit(1);
  });

