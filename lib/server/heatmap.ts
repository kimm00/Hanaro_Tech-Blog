// lib/server/heatmap.ts

export type HeatmapItem = {
  date: Date;
  count: number;
};

type ActivityMap = Record<string, number>;

const dateKey = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 작성일 / 수정일 기반 활동 맵 생성
 */
export function buildActivityMap(
  posts: { created_at: Date; updated_at: Date | null }[],
): ActivityMap {
  const map: ActivityMap = {};

  for (const post of posts) {
    // 작성 = 활동 1회
    const createdKey = dateKey(post.created_at);
    map[createdKey] = (map[createdKey] ?? 0) + 1;

    // 수정 = 활동 1회 (같은 날이어도 카운트)
    if (post.updated_at) {
      const updatedKey = dateKey(post.updated_at);
      map[updatedKey] = (map[updatedKey] ?? 0) + 1;
    }
  }

  return map;
}

/**
 * 최근 1년(52주 × 7일) 잔디 데이터 생성
 * 0,1,2,3,4(이상) 단계
 */
export function buildHeatmapData(activityMap: ActivityMap) {
  // ✅ 2026년 고정
  const start = new Date(2026, 0, 1); // Jan 1
  const end = new Date(2026, 11, 31); // Dec 31
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const data: { date: Date; count: number }[] = [];

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const key = dateKey(d);

    data.push({
      date: new Date(d),
      count: Math.min(activityMap[key] ?? 0, 4),
    });
  }

  return data;
}

export function buildYearHeatmapData(
  year: number,
  activityMap: Record<string, number>,
) {
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const data = [];

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const key = dateKey(d);

    data.push({
      date: new Date(d),
      count: Math.min(activityMap[key] ?? 0, 4),
    });
  }

  return data;
}
