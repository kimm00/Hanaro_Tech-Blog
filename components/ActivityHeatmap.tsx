'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { HeatmapItem } from '@/lib/server/heatmap';

type Props = {
  data?: HeatmapItem[]; // ✅ optional
};

const months = [
  '1월',
  '2월',
  '3월',
  '4월',
  '5월',
  '6월',
  '7월',
  '8월',
  '9월',
  '10월',
  '11월',
  '12월',
];

export default function ActivityHeatmap({ data = [] }: Props) {
  /** 총 활동 수 */
  const totalCount = data.reduce((sum, d) => sum + d.count, 0);

  /** 색상 단계 */
  const getIntensityColor = (count: number) => {
    if (count === 0) return 'bg-muted';
    if (count === 1) return 'bg-emerald-300';
    if (count === 2) return 'bg-emerald-400';
    if (count === 3) return 'bg-emerald-500';
    return 'bg-emerald-600';
  };

  /** 데이터 없을 때도 1년 분량 뼈대 유지 */
  const safeData =
    data.length > 0
      ? data
      : Array.from({ length: 365 }, (_, i) => ({
          date: new Date(new Date().setDate(new Date().getDate() - (364 - i))),
          count: 0,
        }));

  /** GitHub처럼 요일 정렬 (Mon 시작) */
  const firstDay = safeData[0].date.getDay(); // 0=Sun

  if (data.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="font-semibold text-lg">활동 기록</h3>
        <p className="text-muted-foreground text-sm">
          로그인 후 활동 기록이 표시됩니다.
        </p>
      </div>
    );
  }
  const padCount = firstDay === 0 ? 6 : firstDay - 1;

  const paddedData: (HeatmapItem | null)[] = [
    ...Array(padCount).fill(null),
    ...safeData,
  ];

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      {/* ===== 헤더 ===== */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold text-lg">활동 기록</h3>
          <p className="text-muted-foreground text-sm">
            최근 1년간의 작성/수정 활동 · 총 {totalCount}회
          </p>
        </div>

        {/* 범례 */}
        <div className="flex items-center gap-2 text-muted-foreground text-xs">
          <span>적음</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((l) => (
              <div
                key={l}
                className={`h-3 w-3 rounded-sm ${getIntensityColor(l)}`}
              />
            ))}
          </div>
          <span>많음</span>
        </div>
      </div>

      {/* ===== 월 라벨 ===== */}
      <div className="mb-2 ml-10 grid grid-cols-12 text-muted-foreground text-xs">
        {months.map((m) => (
          <div key={m}>{m}</div>
        ))}
      </div>

      {/* ===== 요일 + 잔디 ===== */}
      <TooltipProvider delayDuration={0}>
        <div className="flex">
          {/* 요일 */}
          <div className="mr-2 flex flex-col justify-between py-1 text-muted-foreground text-xs">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          {/* 잔디 */}
          <div className="overflow-x-auto">
            <div
              className="inline-grid gap-1"
              style={{
                gridTemplateColumns: 'repeat(53, 1fr)',
                gridTemplateRows: 'repeat(7, 1fr)',
                gridAutoFlow: 'column',
              }}
            >
              {paddedData.map((item, i) =>
                item ? (
                  <Tooltip key={i}>
                    <TooltipTrigger asChild>
                      <div
                        className={`h-3 w-3 rounded-sm transition hover:ring-2 hover:ring-primary hover:ring-offset-1 ${getIntensityColor(item.count)}`}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        {item.date.toLocaleDateString('ko-KR')}
                      </p>
                      <p className="font-semibold text-xs">
                        {item.count}회 활동
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <div key={i} className="h-3 w-3" />
                ),
              )}
            </div>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}
