import PostEditor from '@/components/PostEditor';
import { auth } from '@/lib/server/auth';
import { redirect } from 'next/navigation';

export default async function NewPostPage() {
  const session = await auth();
  if (!session) {
    redirect('/sign'); // 또는 '/'
  }

  return <PostEditor mode="create" />;
}
