'use server';

import { prisma } from '@/lib/server/prisma';
import { auth } from '@/lib/server/auth';
import { revalidatePath } from 'next/cache';

/* =========================
   CREATE
========================= */
export async function createPost(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('로그인이 필요합니다.');
  }

  const title = formData.get('title')?.toString();
  const contents = formData.get('contents')?.toString();
  const categoryTitle = formData.get('category')?.toString() ?? '기타';

  if (!title) {
    throw new Error('제목이 필요합니다.');
  }

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
}

/* =========================
   UPDATE
========================= */
export async function updatePost(postId: number, formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('로그인이 필요합니다.');
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { writer: true },
  });

  if (!post) {
    throw new Error('게시글이 존재하지 않습니다.');
  }

  const isOwner = post.writer === Number(session.user.id);
  const isAdmin = session.user.isadmin === true;

  if (!isOwner && !isAdmin) {
    throw new Error('권한이 없습니다.');
  }

  await prisma.post.update({
    where: { id: postId },
    data: {
      title: formData.get('title') as string,
      contents: formData.get('contents') as string,
    },
  });

  revalidatePath(`/posts/${postId}`);
}

/* =========================
   DELETE
========================= */
export async function deletePost(postId: number) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('로그인이 필요합니다.');
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { writer: true },
  });

  if (!post) {
    throw new Error('게시글이 존재하지 않습니다.');
  }

  const isOwner = post.writer === Number(session.user.id);
  const isAdmin = session.user.isadmin === true;

  if (!isOwner && !isAdmin) {
    throw new Error('권한이 없습니다.');
  }

  await prisma.post.delete({
    where: { id: postId },
  });

  revalidatePath('/');
}
