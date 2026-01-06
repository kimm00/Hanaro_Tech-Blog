'use server';

import { prisma } from '@/lib/server/prisma';
import { auth } from '@/lib/server/auth';
import { revalidatePath } from 'next/cache';

/* =========================
   댓글 생성
========================= */
export async function createComment(
  postId: number,
  parentId: number | null,
  formData: FormData,
) {
  const session = await auth();
  if (!session?.user) throw new Error('로그인이 필요합니다.');

  const content = formData.get('content') as string;
  if (!content || !content.trim()) {
    return { error: '댓글 내용을 입력하세요.' };
  }

  await prisma.comment.create({
    data: {
      content: content.trim(),
      Post: {
        connect: { id: postId },
      },
      User: {
        connect: { id: Number(session.user.id) },
      },
      ...(parentId !== null && {
        Parent: {
          connect: { id: parentId },
        },
      }),
    },
  });

  revalidatePath(`/posts/${postId}`);
  return { success: true };
}

/* =========================
   댓글 수정
========================= */
export async function updateComment(
  commentId: number,
  postId: number,
  formData: FormData,
) {
  const session = await auth();
  if (!session?.user) throw new Error('로그인이 필요합니다.');

  const content = formData.get('content') as string;
  if (!content || !content.trim()) {
    return { error: '댓글 내용을 입력하세요.' };
  }

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });
  if (!comment) throw new Error('댓글 없음');

  const isOwner = comment.writer === Number(session.user.id);
  const isAdmin = session.user.isadmin === true;

  if (!isOwner && !isAdmin) {
    throw new Error('권한 없음');
  }

  await prisma.comment.update({
    where: { id: commentId },
    data: {
      content: content.trim(),
      updated_at: new Date(),
    },
  });

  revalidatePath(`/posts/${postId}`);
  return { success: true };
}

/* =========================
   댓글 삭제 (소프트 삭제)
========================= */
export async function deleteComment(commentId: number, postId: number) {
  const session = await auth();
  if (!session?.user) throw new Error('로그인이 필요합니다.');

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });
  if (!comment) throw new Error('댓글 없음');

  const isOwner = comment.writer === Number(session.user.id);
  const isAdmin = session.user.isadmin === true;
  if (!isOwner && !isAdmin) throw new Error('권한 없음');

  await prisma.comment.update({
    where: { id: commentId },
    data: {
      is_deleted: true,
      deleted_at: new Date(),
    },
  });

  revalidatePath(`/posts/${postId}`);
  return { success: true };
}

/* =========================
   댓글 전체 조회 (관리자)
========================= */
export async function getAllComments() {
  return prisma.comment.findMany({
    orderBy: { created_at: 'desc' },
    include: {
      User: true,
      Post: true,
    },
  });
}

/* =========================
   댓글 삭제 (관리자용 alias)
========================= */
export async function adminDeleteCommentAction(formData: FormData) {
  const commentId = Number(formData.get('commentId'));
  const postId = Number(formData.get('postId'));

  if (!commentId || !postId) {
    throw new Error('잘못된 요청');
  }

  await deleteComment(commentId, postId);
}
