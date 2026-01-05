import { prisma } from '@/lib/server/prisma';
import { auth } from '@/lib/server/auth';
import { redirect } from 'next/navigation';
import PostEditor from '@/components/PostEditor';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPage({ params }: Props) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user?.isadmin) redirect('/');

  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    include: { Category: true },
  });

  if (!post) redirect('/posts');

  return (
    <PostEditor
      mode="edit"
      post={{
        id: post.id,
        title: post.title,
        contents: post.contents,
        category: post.Category.title,
      }}
    />
  );
}
