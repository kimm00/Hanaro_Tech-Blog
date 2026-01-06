'use server';

import { prisma } from '@/lib/server/prisma';

export async function getStopWords() {
  return prisma.stopWord.findMany({
    orderBy: { id: 'desc' },
  });
}

export async function addStopWord(formData: FormData) {
  const value = formData.get('value')?.toString().trim();
  if (!value) return;

  try {
    await prisma.stopWord.create({ data: { value } });
  } catch {}
}

export async function deleteStopWord(id: number) {
  await prisma.stopWord.delete({ where: { id } });
}
