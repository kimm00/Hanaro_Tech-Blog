'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

export async function updateProfile(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const name = formData.get('name') as string;
  const image = formData.get('image') as string;

  await prisma.user.update({
    where: { id: Number(session.user.id) },
    data: {
      name,
      image: image || null,
    },
  });

  // 🔥 중요: 헤더/세션 갱신
  revalidatePath('/');
  revalidatePath('/profile');
}
