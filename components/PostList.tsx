import { prisma } from '@/lib/server/prisma';
import Link from 'next/link';
import NewPostButton from './NewPostButton';

type Props = {
  category: string;
};

export default async function PostList({ category }: Props) {
  const posts = await prisma.post.findMany({
    where: category === '전체보기' ? {} : { Category: { title: category } },
    include: { Category: true },
    orderBy: { id: 'desc' },
  });

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">{category}</h1>
        <NewPostButton />
      </div>

      {posts.map((post) => (
        <article
          key={post.id}
          className="space-y-3 border-b pb-6 last:border-b-0"
        >
          {/* ✅ 제목만 링크 */}
          <h2 className="font-semibold text-xl">
            <Link
              href={`/posts/${post.id}`}
              className="text-blue-600 hover:underline"
            >
              {post.title}
            </Link>
          </h2>

          {post.contents && (
            <p className="line-clamp-3 text-sm">{post.contents}</p>
          )}

          <div className="flex gap-2">
            <span className="text-sm text-green-600">
              #{post.Category.title}
            </span>
          </div>

          <div className="text-sm text-muted-foreground">
            {new Date(post.created_at).toLocaleDateString('ko-KR')}
          </div>
        </article>
      ))}
    </div>
  );
}
