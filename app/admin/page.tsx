import { redirect } from 'next/navigation';
import { auth } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const session = await auth();

  // ❌ 비로그인
  if (!session?.user) {
    redirect('/login');
  }

  // ❌ 관리자 아님
  if (!session.user.isadmin) {
    redirect('/');
  }

  const { q } = await searchParams;

  const users = await prisma.user.findMany({
    where: q
      ? {
          OR: [{ email: { contains: q } }, { name: { contains: q } }],
        }
      : {},
    orderBy: { id: 'desc' },
    select: {
      id: true,
      email: true,
      name: true,
      isadmin: true,
    },
  });

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-6 font-bold text-2xl">회원 관리</h1>

      {/* 🔍 검색 */}
      <form className="mb-6">
        <input
          name="q"
          defaultValue={q}
          placeholder="이메일 또는 이름 검색"
          className="w-full rounded border px-4 py-2"
        />
      </form>

      {/* 👥 회원 목록 */}
      <table className="w-full border-collapse border text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="border px-3 py-2 text-left">ID</th>
            <th className="border px-3 py-2 text-left">이름</th>
            <th className="border px-3 py-2 text-left">이메일</th>
            <th className="border px-3 py-2 text-left">권한</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="border px-3 py-2">{u.id}</td>
              <td className="border px-3 py-2">{u.name}</td>
              <td className="border px-3 py-2">{u.email}</td>
              <td className="border px-3 py-2">
                {u.isadmin ? '관리자' : '일반'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <p className="mt-6 text-center text-gray-400">검색 결과가 없습니다.</p>
      )}
    </main>
  );
}
