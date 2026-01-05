'use client';

type Props = {
  year: number;
  onChange: (year: number) => void;
};

export default function HeatmapYearSelector({ year, onChange }: Props) {
  const years = [2026, 2025, 2024, 2023];

  return (
    <div className="flex flex-col gap-2 text-sm">
      {years.map((y) => (
        <button
          key={y}
          onClick={() => onChange(y)}
          className={`rounded-md px-3 py-1 text-left
            ${y === year ? 'bg-blue-600 text-white' : 'hover:bg-muted'}
          `}
        >
          {y}
        </button>
      ))}
    </div>
  );
}
