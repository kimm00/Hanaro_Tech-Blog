// 이메일/비번 로그인

'use client';

import type { Route } from 'next';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActionState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginEmail } from '@/lib/server/sign.action';
import type { ValidError } from '@/lib/server/validator';

const initialState: ValidError = {
  error: {},
  data: {},
};

export default function SignForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('callbackUrl') || '/';

  const [validError, login, isPending] = useActionState(
    async (_prev: ValidError, formData: FormData): Promise<ValidError> => {
      const [err] = await loginEmail(formData);

      // ❌ 로그인 실패 → 에러 상태 반환
      if (err) {
        return err as ValidError;
      }

      // ✅ 로그인 성공
      toast.success('로그인 성공 👋');

      // UX 좋게 살짝 딜레이
      setTimeout(() => {
        router.push(redirectTo as Route);
      }, 600);

      // ⚠️ 반드시 state 반환
      return initialState;
    },
    initialState,
  );

  return (
    <div className="grid place-items-center">
      <form action={login} className="w-full max-w-sm space-y-4">
        <input type="hidden" name="redirectTo" value={redirectTo} />

        {/* email */}
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={validError.data.email ?? ''}
            placeholder="user@email.com"
          />
          {validError.error.email && (
            <p className="text-red-500 text-sm">{validError.error.email}</p>
          )}
        </div>

        {/* password */}
        <div className="space-y-1">
          <Label htmlFor="passwd">Password</Label>
          <Input
            id="passwd"
            name="passwd"
            type="password"
            defaultValue={validError.data.passwd ?? ''}
            placeholder="password..."
          />
          {validError.error.passwd && (
            <p className="text-red-500 text-sm">{validError.error.passwd}</p>
          )}
        </div>

        <div className="flex justify-center gap-4">
          <Button type="reset" variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            Log In{isPending && '...'}
          </Button>
        </div>
      </form>
    </div>
  );
}
