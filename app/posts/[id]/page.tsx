import Link from 'next/link';
import CommentForm from '@/components/comment/CommentForm';
import CommentList from '@/components/comment/CommentList';
import { auth } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

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
      User: true,
    },
  });

  if (!post) {
    return <div className="p-8">글이 존재하지 않습니다.</div>;
  }

  // 댓글 조회 (Comment 기준이 정답)
  const comments = await prisma.comment.findMany({
    where: {
      post_id: postId,
      parent_id: null,
    },
    select: {
      id: true,
      content: true,
      writer: true, // 🔥 이거 필수
      parent_id: true,
      is_deleted: true,
      created_at: true,
      updated_at: true,
      User: {
        select: {
          id: true,
          name: true,
          image: true,
          isadmin: true,
        },
      },
      Replies: {
        select: {
          id: true,
          content: true,
          writer: true, // 🔥 여기도 필수
          parent_id: true,
          is_deleted: true,
          created_at: true,
          updated_at: true,
          User: {
            select: {
              id: true,
              name: true,
              image: true,
              isadmin: true,
            },
          },
        },
      },
    },
    orderBy: { created_at: 'asc' },
  });

  const isOwner = post.writer === Number(session?.user?.id);
  const isAdmin = session?.user?.isadmin === true;

  return (
    <div className="relative mx-auto max-w-3xl p-8">
      {/* 작성자 또는 관리자 편집 버튼 */}
      {(isOwner || isAdmin) && (
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

      {/* 🔥 댓글 작성 폼 (로그인한 경우만) */}
      {session?.user && <CommentForm postId={postId} parentId={null} />}

      {/* 댓글 목록 */}
      <CommentList postId={postId} comments={comments} />
    </div>
  );
}
