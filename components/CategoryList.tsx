'use client';

import Link from 'next/link';
import { CATEGORIES } from '@/lib/categories';
import clsx from 'clsx';
import { Route } from 'next';

type Props = {
  current: string;
  horizontal?: boolean;
};

export default function CategoryList({ current, horizontal = false }: Props) {
  return (
    <nav
      className={clsx(
        horizontal
          ? // ✅ 가로 스크롤 버전
            '-mx-6 flex gap-2 overflow-x-auto whitespace-nowrap px-6 pb-3'
          : // ✅ (혹시 나중에 쓸) 세로 버전
            'border-r pr-4',
      )}
    >
      {/* 전체보기 */}
      <Link
        href={'/' as Route}
        className={clsx(baseStyle, current === '전체보기' && activeStyle)}
      >
        전체보기
      </Link>

      {/* 나머지 카테고리 */}
      {CATEGORIES.map((name) => {
        const isActive = current === name;
        const href = `/?category=${encodeURIComponent(name)}`;

        return (
          // biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
          <Link
            key={name}
            href={href as Route}
            className={clsx(baseStyle, isActive && activeStyle)}
          >
            {name}
          </Link>
        );
      })}
    </nav>
  );
}

/* ✅ 스타일 상수 (가독성 ↑) */
const baseStyle =
  'px-4 py-2 rounded-full text-sm font-medium transition bg-gray-100 text-gray-700 hover:bg-gray-200';

const activeStyle = 'bg-green-500 text-white hover:bg-green-500';
