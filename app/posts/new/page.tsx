import PostEditor from '@/components/PostEditor';
import { auth } from '@/lib/server/auth';
import { redirect } from 'next/navigation';

export default async function NewPostPage() {
  const session = await auth();
  if (!session?.user?.isadmin) redirect('/');

  return <PostEditor mode="create" />;
}
