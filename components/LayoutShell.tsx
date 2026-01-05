'use client';

import { usePathname } from 'next/navigation';

export default function LayoutShell({
  children,
  heatmap,
}: {
  children: React.ReactNode;
  heatmap: React.ReactNode;
}) {
  const pathname = usePathname();

  const isEditorPage =
    pathname === '/posts/new' ||
    (pathname.startsWith('/posts/') && pathname !== '/posts');

  return (
    <>
      {!isEditorPage && heatmap}
      {children}
    </>
  );
}
