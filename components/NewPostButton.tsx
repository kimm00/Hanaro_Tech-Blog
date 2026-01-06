// components/NewPostButton.tsx
import Link from 'next/link';

export default function NewPostButton() {
  return (
    <Link
      href="/posts/new"
      className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-full bg-sky-100 px-4 py-2 font-semibold text-sky-800 text-sm shadow-sm transition-all duration-200 hover:scale-105 hover:bg-sky-200 active:scale-95"
    >
      <span className="text-lg">✏️</span>
      <span>새 글 작성</span>
    </Link>
  );
}
