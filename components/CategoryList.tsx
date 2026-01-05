'use client';

import Link from 'next/link';
import { CATEGORIES } from '@/lib/categories';

type Props = {
  current: string;
};

export default function CategoryList({ current }: Props) {
  return (
    <aside className="border-r pr-4">
      <ul className="space-y-2">
        <li>
          <Link
            href="/"
            className={
              current === '전체보기'
                ? 'font-bold text-primary'
                : 'hover:underline'
            }
          >
            전체보기
          </Link>
        </li>

        {CATEGORIES.map((name) => {
          const isActive = current === name;
          const href = `/?category=${encodeURIComponent(name)}`;

          return (
            <li key={name}>
              <Link
                href={href}
                className={
                  isActive ? 'font-bold text-primary' : 'hover:underline'
                }
              >
                {name}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
