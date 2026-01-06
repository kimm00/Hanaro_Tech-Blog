'use client';

import { Github } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';

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
