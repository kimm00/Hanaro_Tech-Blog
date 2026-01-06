import { getUsers } from './action';

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: {
    q?: string;
    role?: 'admin' | 'user';
    out?: 'active' | 'out';
  };
}) {
  const users = await getUsers(searchParams);

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">👥 회원 관리</h1>

      <ul className="space-y-2">
        {users.map((u) => (
          <li key={u.id} className="border p-3">
            <p>{u.email}</p>
            <p className="text-sm text-gray-500">
              {u.isadmin ? '관리자' : '일반 사용자'} ·{' '}
              {u.outdt ? '탈퇴' : '활성'}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
