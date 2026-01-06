'use client';

import { useActionState } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPost, updatePost, deletePost } from '@/app/posts/post.action';
import { CATEGORIES } from '@/lib/categories';

type Props = {
  mode: 'create' | 'edit';
  post?: {
    id: number;
    title: string;
    contents?: string | null;
    category?: string | null;
  };
};

export default function PostEditor({ mode, post }: Props) {
  const router = useRouter();
  const action = mode === 'edit' ? updatePost.bind(null, post!.id) : createPost; // create는 그냥 redirect

  const [state, formAction] = useActionState(action, null);
  const [open, setOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!post) return;

    setDeleting(true);
    const res = await deletePost(post.id);

    if (res?.success) {
      router.push('/'); // 홈으로 이동
    }
  };

  useEffect(() => {
    if (state?.success && mode === 'edit') {
      setOpen(true);
    }
  }, [state, mode]);

  return (
    <>
      {/* ✅ 편집 성공 모달 */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="rounded bg-white p-6">
            <p className="mb-4 font-bold text-lg">✏️ 편집 성공!</p>
            {/** biome-ignore lint/a11y/useButtonType: <explanation> */}
            <button
              onClick={() => router.push('/')}
              className="rounded bg-green-500 px-4 py-2 text-white"
            >
              확인
            </button>
          </div>
        </div>
      )}

      <form action={formAction} className="max-w-3xl p-8">
        <input
          name="title"
          placeholder="제목"
          defaultValue={post?.title ?? ''}
          className="mb-3 w-full rounded border border-gray-300 px-3 py-2 text-black"
        />

        <select
          name="category"
          defaultValue={post?.category ?? ''}
          className="mb-4 w-64 rounded border border-gray-300 bg-white px-3 py-2 text-black"
        >
          <option value="" disabled>
            카테고리 선택
          </option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <textarea
          name="contents"
          placeholder="내용"
          defaultValue={post?.contents ?? ''}
          className="min-h-[300px] w-full rounded border border-gray-300 px-3 py-2 text-black"
        />

        <div className="mt-6 flex gap-4">
          <button
            type="submit"
            className="rounded bg-green-500 px-6 py-2 text-white"
          >
            {mode === 'edit' ? '수정하기' : '출간하기'}
          </button>

          {mode === 'edit' && (
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              className="rounded bg-red-500 px-6 py-2 text-white"
            >
              삭제하기
            </button>
          )}
        </div>
      </form>

      {deleteOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="w-80 rounded bg-white p-6">
            <p className="mb-4 font-bold text-lg">🗑️ 게시글 삭제</p>
            <p className="mb-6 text-gray-600 text-sm">
              이 게시글은 삭제하면 복구할 수 없습니다.
              <br />
              정말 삭제하시겠습니까?
            </p>

            <div className="flex justify-end gap-3">
              {/** biome-ignore lint/a11y/useButtonType: <explanation> */}
              <button
                onClick={() => setDeleteOpen(false)}
                className="rounded border px-4 py-2"
              >
                취소
              </button>

              {/** biome-ignore lint/a11y/useButtonType: <explanation> */}
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded bg-red-500 px-4 py-2 text-white"
              >
                {deleting ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
