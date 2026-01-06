import type { Route } from 'next';
import { redirect } from 'next/navigation';
import PostEditor from '@/components/PostEditor';
import { auth } from '@/lib/server/auth';

export default async function NewPostPage() {
  const session = await auth();
  if (!session) {
    redirect('/sign' as Route);
  }

  return <PostEditor mode="create" />;
}
