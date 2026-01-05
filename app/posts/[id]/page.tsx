import { prisma } from '@/lib/server/prisma';
import { auth } from '@/lib/server/auth';
import Link from 'next/link';
import CommentForm from '@/components/CommentForm';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  const postId = Number(id);

  const session = await auth();

  // 게시글 조회
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      Category: true,
    },
  });

  if (!post) {
    return <div className="p-8">글이 존재하지 않습니다.</div>;
  }

  // 댓글 조회 (Comment 기준이 정답)
  const comments = await prisma.comment.findMany({
    where: {
      post_id: postId,
      parent_id: null, // 최상위 댓글
    },
    include: {
      User: true,
      Replies: {
        include: { User: true },
        orderBy: { created_at: 'asc' },
      },
    },
    orderBy: { created_at: 'asc' },
  });

  return (
    <div className="relative mx-auto max-w-3xl p-8">
      {/* 관리자 편집 버튼 */}
      {session?.user?.isadmin && (
        <Link
          href={`/posts/${post.id}/edit`}
          className="absolute top-8 right-8 rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
        >
          ✏️ 편집
        </Link>
      )}

      {/* 게시글 */}
      <h1 className="font-bold text-3xl">{post.title}</h1>
      <p className="mt-4">{post.contents}</p>
      <p className="mt-4 text-gray-400 text-sm">
        #{post.Category?.title} · {post.created_at.toLocaleDateString()}
      </p>

      <hr className="my-8" />

      {/* 댓글 */}
      <h2 className="mb-4 font-bold text-lg">댓글</h2>

      <CommentForm postId={postId} parentId={null} />

      <ul className="mt-6 space-y-6">
        {comments.map((c) => (
          <li key={c.id}>
            <b>{c.User.name}</b>
            <p>{c.content}</p>

            {/* 대댓글 */}
            <div className="mt-2 ml-4">
              <CommentForm postId={postId} parentId={c.id} />
            </div>

            <ul className="mt-3 ml-6 space-y-2">
              {c.Replies.map((r) => (
                <li key={r.id}>
                  <b>{r.User.name}</b> {r.content}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
