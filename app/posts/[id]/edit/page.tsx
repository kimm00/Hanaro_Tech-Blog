import { prisma } from '@/lib/server/prisma';
import { auth } from '@/lib/server/auth';
import { redirect } from 'next/navigation';
import PostEditor from '@/components/PostEditor';
import { Route } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPage({ params }: Props) {
  const { id } = await params;

  const session = await auth();
  if (!session) redirect('/sign' as Route);

  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      writer: true, // ⭐ 이거 중요
      title: true,
      contents: true,
      Category: { select: { title: true } },
    },
  });

  if (!post) redirect('/posts' as Route);

  const isOwner = post.writer === Number(session.user.id);
  const isAdmin = session.user.isadmin === true;

  console.log('EDIT DEBUG', {
    postWriter: post.writer,
    sessionUserId: session.user.id,
    sessionUserIdType: typeof session.user.id,
  });

  if (!isOwner && !isAdmin) {
    redirect('/posts' as Route);
  }

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
