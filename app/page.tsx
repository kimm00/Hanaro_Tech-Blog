// app/page.tsx (Server Component)

import { prisma } from '@/lib/server/prisma';
import { auth } from '@/lib/server/auth';
import { buildActivityMap, buildYearHeatmapData } from '@/lib/server/heatmap';

import ActivityHeatmap from '@/components/ActivityHeatmap';
import CategoryList from '@/components/CategoryList';
import PostList from '@/components/PostList';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const session = await auth();

  // ✅ 반드시 await
  const { category = '전체보기' } = await searchParams;

  /** 로그인 안 했으면 잔디 비움 */
  let heatmapData = [];

  if (session?.user) {
    const posts = await prisma.post.findMany({
      where: {
        writer: Number(session.user.id),
      },
      select: {
        created_at: true,
        updated_at: true,
      },
    });

    const activityMap = buildActivityMap(posts);
    const year = new Date().getFullYear();
    heatmapData = buildYearHeatmapData(year, activityMap);
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <ActivityHeatmap data={heatmapData} />

      {/* 가로 카테고리 */}
      <div className="mt-10">
        <CategoryList current={category} horizontal />
      </div>

      {/* 글 목록 */}
      <div className="mt-6">
        <PostList category={category} />
      </div>
    </main>
  );
}
