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

  for (const post of posts) {
    const date = post.updated_at ?? post.created_at;
    const key = dateKey(date);

    map[key] = (map[key] ?? 0) + 1;
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
      count: Math.min(activityMap[key] ?? 0, 4),
    });
  }

  return data;
}
