'use client';

import { useState } from 'react';
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

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /* =====================
     제출 핸들러 (핵심)
  ===================== */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      if (mode === 'edit') {
        await updatePost(post!.id, formData);
      } else {
        await createPost(formData);
      }
      router.push('/');
    } catch (err: any) {
      alert(err.message ?? '오류 발생');
    }
  };

  /* =====================
     삭제 핸들러
  ===================== */
  const handleDelete = async () => {
    if (!post) return;

    setDeleting(true);
    try {
      await deletePost(post.id);
      router.push('/');
    } catch (err: any) {
      alert(err.message ?? '삭제 실패');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-3xl p-8">
        <input
          name="title"
          placeholder="제목"
          defaultValue={post?.title ?? ''}
          className="mb-3 w-full rounded border px-3 py-2"
        />

        <select
          name="category"
          defaultValue={post?.category ?? ''}
          className="mb-4 w-64 rounded border bg-white px-3 py-2"
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
          className="min-h-[300px] w-full rounded border px-3 py-2"
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

      {/* 삭제 확인 모달 */}
      {deleteOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="w-80 rounded bg-white p-6">
            <p className="mb-4 font-bold text-lg">🗑️ 게시글 삭제</p>
            <p className="mb-6 text-gray-600 text-sm">정말 삭제하시겠습니까?</p>

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
