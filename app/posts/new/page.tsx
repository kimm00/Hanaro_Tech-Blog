import PostEditor from '@/components/PostEditor';
import { auth } from '@/lib/server/auth';
import { Route } from 'next';
import { redirect } from 'next/navigation';

export default async function NewPostPage() {
  const session = await auth();
  if (!session) {
    redirect('/sign' as Route);
  }

  return <PostEditor mode="create" />;
}
