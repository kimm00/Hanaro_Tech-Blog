import { prisma } from '@/lib/server/prisma';

/**
 * 검색어에서 DB에 저장된 불용어 제거
 */
export async function normalizeQuery(q?: string) {
  if (!q) return [];

  // 1. DB에서 불용어 조회
  const stopwords = await prisma.stopWord.findMany({
    select: { value: true },
  });

  const stopwordSet = new Set(stopwords.map((w) => w.value.toLowerCase()));

  // 2. 검색어 분해 + 불용어 제거
  return q
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => !stopwordSet.has(word));
}
