// app/admin/layout.tsx
import { auth } from '@/lib/server/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.isadmin) {
    redirect('/');
  }

  return <>{children}</>;
}
