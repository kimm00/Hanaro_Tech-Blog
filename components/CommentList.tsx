'use client';

import CommentForm from './CommentForm';

export default function CommentList({ postId, comments }: any) {
  return (
    <div className="mt-12">
      <h2 className="mb-4 font-bold text-lg">댓글</h2>

      {/* 댓글 작성 */}
      <CommentForm postId={postId} parentId={null} />

      {/* 댓글 목록 */}
      <ul className="mt-6 space-y-6">
        {comments.map((comment: any) => (
          <li key={comment.id}>
            <CommentItem postId={postId} comment={comment} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function CommentItem({ postId, comment }: any) {
  return (
    <div>
      {/* 댓글 본문 */}
      {comment.is_deleted ? (
        <p className="text-gray-400 italic">삭제된 댓글입니다.</p>
      ) : (
        <>
          <b>{comment.User.name}</b>
          <p>{comment.content}</p>
        </>
      )}

      {/* 대댓글 작성 */}
      <div className="ml-4 mt-2">
        <CommentForm postId={postId} parentId={comment.id} />
      </div>

      {/* 대댓글 목록 */}
      <ul className="ml-6 mt-4 space-y-3">
        {comment.Replies.map((reply: any) => (
          <li key={reply.id}>
            {reply.is_deleted ? (
              <p className="text-gray-400 italic">삭제된 댓글입니다.</p>
            ) : (
              <>
                <b>{reply.User.name}</b>
                <p>{reply.content}</p>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
