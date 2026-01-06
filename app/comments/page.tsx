import { getAllComments, adminDeleteCommentAction } from './comment.action';

export default async function AdminCommentsPage() {
  const comments = await getAllComments();

  return (
    <div>
      <h1 className="mb-4 font-bold text-xl">💬 댓글 관리</h1>

      <ul className="space-y-3">
        {comments.map((c) => (
          <li key={c.id} className="border p-3">
            <p className="text-gray-500 text-sm">
              작성자: {c.User.email} · 게시글: {c.Post.title}
            </p>

            <p className="my-2">
              {c.is_deleted ? (
                <span className="text-gray-400 italic">삭제된 댓글입니다</span>
              ) : (
                c.content
              )}
            </p>

            {!c.is_deleted && (
              <form action={adminDeleteCommentAction}>
                <input type="hidden" name="commentId" value={c.id} />
                <input type="hidden" name="postId" value={c.post_id} />
                {/** biome-ignore lint/a11y/useButtonType: <explanation> */}
                <button className="text-red-500 text-sm">관리자 삭제</button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
