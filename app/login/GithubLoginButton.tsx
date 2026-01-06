'use client';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { Github } from 'lucide-react';

export function GithubLoginButton() {
  return (
    <Button
      type="button"
      onClick={() => signIn('github')}
      className="flex h-12 w-full items-center justify-center gap-3 rounded-md bg-[#181717] text-white hover:bg-black"
    >
      <Github className="h-5 w-5" />
      <span>GitHub로 계속하기</span>
    </Button>
  );
}
