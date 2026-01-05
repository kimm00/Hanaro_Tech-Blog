'use client';

import { useActionState } from 'react';
import { createComment } from '@/app/comments/comment.action';

export default function CommentForm({
  postId,
  parentId,
}: {
  postId: number;
  parentId: number | null;
}) {
  const action = createComment.bind(null, postId, parentId);
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className="mt-2 flex gap-2">
      <input
        name="content"
        placeholder={parentId ? '답글 달기...' : '댓글을 입력하세요'}
        className="flex-1 border px-2 py-1"
      />
      <button type="submit" className="rounded bg-black px-3 py-1 text-white">
        등록
      </button>

      {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
    </form>
  );
}
