// app/page.tsx (Server Component)

import { prisma } from '@/lib/server/prisma';
import { buildActivityMap, buildHeatmapData } from '@/lib/server/heatmap';

import ActivityHeatmap from '@/components/ActivityHeatmap';
import CategoryList from '@/components/CategoryList';
import PostList from '@/components/PostList';

export default async function HomePage(props: {
  searchParams: Promise<{ category?: string }>;
}) {
  const searchParams = await props.searchParams;
  const category = searchParams.category ?? '전체보기';

  // 🌱 잔디밭용 데이터 (작성/수정일만)
  const posts = await prisma.post.findMany({
    select: {
      created_at: true,
      updated_at: true,
    },
  });

  const activityMap = buildActivityMap(posts);
  const heatmapData = buildHeatmapData(activityMap);

  return (
    <main className="space-y-10 px-6 py-10">
      {/* 🌱 잔디밭 (첫 페이지 상단) */}
      <ActivityHeatmap data={heatmapData} />

      {/* 📄 기존 레이아웃 그대로 */}
      <div className="grid grid-cols-[240px_1fr] gap-6">
        <CategoryList current={category} />
        <PostList category={category} />
      </div>
    </main>
  );
}
