'use client';

import type { Route } from 'next';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function PostToastHandler() {
  const params = useSearchParams();
  const router = useRouter();
  const routeParams = useParams();

  const postId = routeParams.id as string | undefined;

  useEffect(() => {
    if (params.get('created') && postId) {
      toast.success('🎉 글 작성 완료!');
      router.replace(`/posts/${postId}/edit`, { scroll: false });
    }

    if (params.get('updated')) {
      toast.success('✏️ 글 수정 완료!');
      router.replace('/posts' as Route, { scroll: false });
    }
  }, [params, router, postId]);

  return null;
}
