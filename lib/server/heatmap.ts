// lib/server/heatmap.ts

export type HeatmapItem = {
  date: Date;
  count: number;
};

const dateKey = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export function buildActivityMap(
  posts: { created_at: Date; updated_at: Date | null }[],
) {
  const map: Record<string, number> = {};

  const add = (date: Date) => {
    const key = dateKey(date);
    map[key] = (map[key] ?? 0) + 1;
  };

  for (const post of posts) {
    // ✅ 1. 작성은 무조건 1회
    add(post.created_at);

    // ✅ 2. 수정이 실제로 일어난 경우만 +1
    if (
      post.updated_at &&
      post.updated_at.getTime() !== post.created_at.getTime()
    ) {
      add(post.updated_at);
    }
  }

  return map;
}

export function buildYearHeatmapData(
  year: number,
  activityMap: Record<string, number>,
): HeatmapItem[] {
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const data: HeatmapItem[] = [];

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const key = dateKey(d);
    data.push({
      date: new Date(d),
      count: activityMap[key] ?? 0,
    });
  }

  return data;
}
