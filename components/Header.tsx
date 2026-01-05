// components/Header.tsx
import Link from 'next/link';

import { logout } from '@/lib/server/sign.action';
import { auth } from '@/lib/server/auth';

export default async function Header() {
  const session = await auth();

  return (
    <header style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* 왼쪽 */}
        <div>
          <Link href="/">홈</Link>
        </div>

        {/* 오른쪽 */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {!session ? (
            <>
              <Link href="/login">로그인</Link>
              {/* <Link href="/signup">회원가입</Link> */}
            </>
          ) : (
            <>
              <span>{session.user?.email}</span>
              <form action={logout}>
                <button type="submit">로그아웃</button>
              </form>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
