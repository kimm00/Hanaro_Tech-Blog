'use client';

import { toggleLike } from '@/app/likes/actions';

type Props = {
  postId: number;
  isLiked: boolean;
};

export default function LikeButton({ postId, isLiked }: Props) {
  return (
    <form action={async () => await toggleLike(postId)}>
      <button
        type="submit"
        className="group cursor-pointer transition-all duration-150 hover:scale-125 focus:scale-125 active:scale-110"
        title={isLiked ? '좋아요 취소' : '좋아요'}
      >
        <span
          className={`inline-block transition-colors ${
            isLiked ? 'text-red-500' : 'text-gray-400 group-hover:text-red-500'
          }group-hover:underline`}
        >
          {isLiked ? '❤️' : '🤍'}
        </span>
      </button>
    </form>
  );
}
