// app/page.tsx (Server Component)

import { prisma } from '@/lib/server/prisma';
import { auth } from '@/lib/server/auth';
import { buildActivityMap, buildYearHeatmapData } from '@/lib/server/heatmap';

import ActivityHeatmap from '@/components/ActivityHeatmap';
import CategoryList from '@/components/CategoryList';
import PostList from '@/components/PostList';
import PostSearch from '@/components/PostSearch';

type HeatmapData = {
  date: string; // ✅ UI용은 string
  count: number;
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const session = await auth();
  const { category = '전체보기', q } = await searchParams;

  let heatmapData: HeatmapData[] = [];

  if (session?.user) {
    const posts = await prisma.post.findMany({
      where: { writer: Number(session.user.id) },
      select: {
        created_at: true,
        updated_at: true,
      },
    });

    const activityMap = buildActivityMap(posts);
    const year = new Date().getFullYear();

    // 👇 Date → string 변환은 여기서 딱 한 번
    heatmapData = buildYearHeatmapData(year, activityMap).map((item) => ({
      date: item.date.toISOString().slice(0, 10),
      count: item.count,
    }));
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <ActivityHeatmap data={heatmapData} />

      {/* 🔍 검색 */}
      <div className="mt-10">
        <PostSearch />
      </div>

      {/* 📂 가로 카테고리 */}
      <div className="mt-4">
        <CategoryList current={category} horizontal />
      </div>

      {/* 📝 글 목록 */}
      <div className="mt-6">
        <PostList category={category} query={q} />
      </div>
    </main>
  );
}
