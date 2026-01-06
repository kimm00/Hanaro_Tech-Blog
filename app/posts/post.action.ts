'use server';

import { prisma } from '@/lib/server/prisma';
import { auth } from '@/lib/server/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/* =========================
   CREATE
========================= */
export async function createPost(_prev: any, formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: '로그인 필요' };

  const title = formData.get('title')?.toString();
  const contents = formData.get('contents')?.toString();
  const categoryTitle = formData.get('category')?.toString() ?? '기타';

  if (!title) return { error: '제목 필요' };

  const cat = await prisma.category.upsert({
    where: { title: categoryTitle },
    update: {},
    create: { title: categoryTitle },
  });

  await prisma.post.create({
    data: {
      title,
      contents,
      category: cat.id,
      writer: Number(session.user.id),
    },
  });

  revalidatePath('/');
  redirect('/');
}

/* =========================
   UPDATE (useActionState)
========================= */
export async function updatePost(
  postId: number,
  _prev: any,
  formData: FormData,
) {
  const session = await auth();
  if (!session) return { success: false };

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { writer: true },
  });

  const isOwner = post?.writer === Number(session.user.id);
  const isAdmin = session.user.isadmin === true;

  if (!isOwner && !isAdmin) {
    return { success: false };
  }

  await prisma.post.update({
    where: { id: postId },
    data: {
      title: formData.get('title') as string,
      contents: formData.get('contents') as string,
    },
  });

  revalidatePath(`/posts/${postId}`);
  return { success: true };
}

/* =========================
   DELETE
========================= */
export async function deletePost(postId: number) {
  const session = await auth();
  if (!session?.user?.isadmin) return { error: '권한 없음' };

  await prisma.post.delete({ where: { id: postId } });
  revalidatePath('/');
  return { success: true };
}
