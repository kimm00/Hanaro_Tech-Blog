'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

export async function toggleLike(postId: number) {
  const session = await auth();
  if (!session?.user) throw new Error('Need login');

  const userId = Number(session.user.id);

  const key = {
    post_id_user_id: {
      post_id: postId,
      user_id: userId,
    },
  };

  const exists = await prisma.postLike.findUnique({
    where: key,
  });

  if (exists) {
    await prisma.postLike.delete({ where: key });
  } else {
    await prisma.postLike.create({
      data: { post_id: postId, user_id: userId },
    });
  }

  // ⭐ 이 한 줄이 핵심
  revalidatePath('/');
}
