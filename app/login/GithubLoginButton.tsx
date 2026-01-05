'use client';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';

export function GithubLoginButton() {
  return (
    <Button
      type="button"
      onClick={() => signIn('github')}
      className="h-12 w-full gap-2 rounded-md bg-[#181717] text-white hover:bg-black"
    >
      GitHub Login
    </Button>
  );
}
