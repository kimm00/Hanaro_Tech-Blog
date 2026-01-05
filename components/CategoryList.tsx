'use client';

import Link from 'next/link';

type Props = {
  current: string;
};

const categories = [
  { name: '전체보기' },
  { name: 'React' },
  { name: '렌더링' },
  { name: 'js' },
];

export default function CategoryList({ current }: Props) {
  return (
    <aside className="border-r pr-4">
      <ul className="space-y-2">
        {categories.map((c) => {
          const isActive = current === c.name;
          const href =
            c.name === '전체보기'
              ? '/'
              : `/?category=${encodeURIComponent(c.name)}`;

          return (
            <li key={c.name}>
              <Link
                href={href}
                className={`flex justify-between ${
                  isActive ? 'font-bold text-primary' : 'hover:underline'
                }`}
              >
                <span>{c.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
