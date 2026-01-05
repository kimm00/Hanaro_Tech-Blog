'use server';

import { prisma } from '@/lib/server/prisma';
import { auth } from '@/lib/server/auth';
import { revalidatePath } from 'next/cache';

export async function createComment(
  postId: number,
  parentId: number | null,
  _prev: any,
  formData: FormData,
) {
  const session = await auth();
  if (!session?.user) return { error: '로그인이 필요합니다' };

  const content = formData.get('content')?.toString();
  if (!content) return { error: '댓글을 입력하세요' };

  await prisma.comment.create({
    data: {
      post_id: postId,
      writer: Number(session.user.id),
      parent_id: parentId,
      content,
    },
  });

  revalidatePath(`/posts/${postId}`);
  return { success: true };
}
