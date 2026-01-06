'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const { data: session, status } = useSession();

  if (status === 'loading') return null;

  return (
    <header className="flex h-14 items-center justify-between border-b px-6">
      {/* 홈 */}
      <Link href="/" className="font-medium">
        홈
      </Link>

      {session?.user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/** biome-ignore lint/a11y/useButtonType: <explanation> */}
            <button className="flex items-center gap-1 font-medium">
              {/* ✅ 이름만 표시 */}
              <span>{session.user.name ?? 'User'}</span>
              {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5.25 7.5L10 12.25L14.75 7.5" />
              </svg>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            {/* 관리자 메뉴 */}
            {session.user.isadmin && (
              <DropdownMenuItem asChild>
                <Link href="/admin">관리자 페이지</Link>
              </DropdownMenuItem>
            )}

            {/* 이메일 표시 */}
            <DropdownMenuItem disabled>{session.user.email}</DropdownMenuItem>

            {/* 로그아웃 */}
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              로그아웃
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link href="/login">로그인</Link>
      )}
    </header>
  );
}
