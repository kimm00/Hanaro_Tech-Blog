'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { updateComment, deleteComment } from '@/app/comments/comment.action';
import CommentForm from './CommentForm';

export default function CommentItem({
  postId,
  comment,
}: {
  postId: number;
  comment: any;
}) {
  const { data: session } = useSession();

  const isOwner = String(comment.writer) === session?.user?.id;
  const isAdmin = session?.user?.isadmin === true;
  const canEdit = isOwner || isAdmin;

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [isReplying, setIsReplying] = useState(false);

  // 삭제된 댓글
  if (comment.is_deleted) {
    return <p className="text-gray-400 italic">삭제된 댓글입니다.</p>;
  }

  return (
    <div className="space-y-2">
      <b>{comment.User.name}</b>

      {/* ================= 수정 ================= */}
      {isEditing ? (
        <>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border p-2"
          />

          <div className="flex gap-2 text-sm">
            <form
              action={async (formData: FormData) => {
                formData.set('content', content);
                const result = await updateComment(
                  comment.id,
                  postId,
                  formData,
                );
                if (result?.success) setIsEditing(false);
              }}
            >
              <button type="submit" className="text-blue-500">
                저장
              </button>
            </form>

            <button
              type="button"
              onClick={() => {
                setContent(comment.content);
                setIsEditing(false);
              }}
              className="text-gray-400"
            >
              취소
            </button>
          </div>
        </>
      ) : (
        <p>{comment.content}</p>
      )}

      {/* ================= 버튼 ================= */}
      {canEdit && !isEditing && (
        <div className="flex gap-2 text-sm">
          <button onClick={() => setIsEditing(true)} className="text-blue-500">
            수정
          </button>
          <button
            onClick={() => deleteComment(comment.id, postId)}
            className="text-red-500"
          >
            삭제
          </button>
        </div>
      )}

      {/* ================= 답글 버튼 (최상위 댓글만) ================= */}
      {session && comment.parent_id === null && (
        <button
          onClick={() => setIsReplying(!isReplying)}
          className="text-sm text-gray-500"
        >
          답글
        </button>
      )}

      {/* ================= 답글 폼 ================= */}
      {isReplying && comment.parent_id === null && (
        <div className="ml-4">
          <CommentForm postId={postId} parentId={comment.id} />
        </div>
      )}

      {/* ================= 대댓글 ================= */}
      {comment.Replies?.length > 0 && (
        <ul className="ml-6 space-y-2">
          {comment.Replies.map((reply: any) => (
            <li key={reply.id}>
              <CommentItem postId={postId} comment={reply} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
