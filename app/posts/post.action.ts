'use server';

import { prisma } from '@/lib/server/prisma';
import { auth } from '@/lib/server/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// ✅ CREATE
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

// ✅ UPDATE (useActionState용 시그니처)
export async function updatePost(
  postId: number,
  _prev: any,
  formData: FormData,
) {
  const session = await auth();
  if (!session?.user?.isadmin) return { error: '권한 없음' };

  const title = formData.get('title')?.toString();
  const contents = formData.get('contents')?.toString();
  const category = formData.get('category')?.toString();

  await prisma.post.update({
    where: { id: postId },
    data: {
      title,
      contents,
      updated_at: new Date(), // ⭐⭐⭐ 이게 핵심
      Category: {
        connectOrCreate: {
          where: { title: category ?? '기타' },
          create: { title: category ?? '기타' },
        },
      },
    },
  });

  revalidatePath('/');
  return { success: true };
}

// ✅ DELETE (직접 호출용)
export async function deletePost(postId: number) {
  const session = await auth();
  if (!session?.user?.isadmin) return { error: '권한 없음' };

  await prisma.post.delete({ where: { id: postId } });
  revalidatePath('/');
  return { success: true };
}
