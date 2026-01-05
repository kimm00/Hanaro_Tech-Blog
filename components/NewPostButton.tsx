'use client';

import Link from 'next/link';

export default function NewPostButton() {
  return (
    <Link
      href="/posts/new"
      className="inline-flex items-center rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800"
    >
      ✏️ 새 글 작성
    </Link>
  );
}
