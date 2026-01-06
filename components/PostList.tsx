import Link from 'next/link';
import { normalizeQuery } from '@/lib/search/normalizeQuery';
import { auth } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';
import LikeButton from './LikeButton';
import NewPostButton from './NewPostButton';

type Props = {
  category: string;
  query?: string;
};

export default async function PostList({ category, query }: Props) {
  const session = await auth();
  const userId = session?.user ? Number(session.user.id) : null;

  // 🔍 불용어 제거된 키워드
  const keywords = await normalizeQuery(query);

  const posts = await prisma.post.findMany({
    where: {
      // 📂 카테고리 필터
      ...(category !== '전체보기' && {
        Category: { title: category },
      }),

      // 🔍 검색 필터 (불용어 제거 후)
      ...(keywords.length > 0 && {
        OR: keywords.flatMap((word) => [
          { title: { contains: word } },
          { contents: { contains: word } },
        ]),
      }),
    },

    orderBy: { id: 'desc' },

    select: {
      id: true,
      title: true,
      contents: true,
      created_at: true,

      Category: {
        select: { title: true },
      },

      _count: {
        select: {
          Comment: { where: { is_deleted: false } },
          PostLike: true,
        },
      },

      PostLike: userId
        ? {
            where: { user_id: userId },
            select: { user_id: true },
          }
        : false,
    },
  });

  const mappedPosts = posts.map((post) => ({
    ...post,
    isLiked: post.PostLike?.length > 0,
  }));

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">
          {query ? `"${query}" 검색 결과` : category}
        </h1>
        {session && <NewPostButton />}
      </div>

      {query && keywords.length === 0 && (
        <p className="text-center text-muted-foreground">
          의미 없는 검색어는 제외됩니다.
        </p>
      )}

      {mappedPosts.length === 0 && (
        <p className="text-center text-muted-foreground">
          검색 결과가 없습니다.
        </p>
      )}

      {mappedPosts.map((post) => (
        <article
          key={post.id}
          className="space-y-3 border-b pb-6 last:border-b-0"
        >
          <h2 className="font-semibold text-xl">
            <Link
              href={`/posts/${post.id}`}
              className="text-blue-600 hover:underline"
            >
              {post.title}
            </Link>
          </h2>

          {post.contents && (
            <p className="line-clamp-3 text-muted-foreground text-sm">
              {post.contents}
            </p>
          )}

          <div className="flex gap-2">
            <span className="text-green-600 text-sm">
              #{post.Category.title}
            </span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span>{new Date(post.created_at).toLocaleDateString('ko-KR')}</span>
            <span>·</span>
            <span>💬 {post._count.Comment}</span>
            <span>·</span>

            <div className="flex items-center gap-1">
              <LikeButton postId={post.id} isLiked={post.isLiked} />
              <span>{post._count.PostLike}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
