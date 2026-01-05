'use client';

'use client';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';

type Props = {
  isRegist?: boolean;
};

export function GoogleLoginButton({ isRegist = false }: Props) {
  return (
    <Button
      type="button"
      onClick={() => signIn('google')}
      variant="outline"
      className="h-12 w-full gap-2"
    >
      {isRegist ? 'Register' : 'Sign in'} with Google
    </Button>
  );
}
