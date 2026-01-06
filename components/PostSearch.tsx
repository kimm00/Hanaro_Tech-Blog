'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function PostSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initial = searchParams.get('q') ?? '';
  const [value, setValue] = useState(initial);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (!value.trim()) {
      params.delete('q');
    } else {
      params.set('q', value.trim());
    }

    router.push(`/?${params.toString()}`);
  };

  return (
    <form onSubmit={onSubmit} className="flex justify-center">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="검색어를 입력하세요"
        className="w-[420px] rounded border px-4 py-2"
      />
    </form>
  );
}
