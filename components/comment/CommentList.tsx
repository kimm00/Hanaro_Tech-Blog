'use client';

import CommentItem from './CommentItem';

export default function CommentList({
  postId,
  comments,
}: {
  postId: number;
  comments: any[];
}) {
  return (
    <div className="mt-6 space-y-4">
      <h3 className="font-semibold">댓글 {comments.length}</h3>

      {comments.map((comment) => (
        <CommentItem key={comment.id} postId={postId} comment={comment} />
      ))}
    </div>
  );
}
