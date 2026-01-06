'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import SignForm from '@/components/auth/SignForm';
import Link from 'next/link';
import { GoogleLoginButton } from './GoogleLoginButton';
import { GithubLoginButton } from './GithubLoginButton';

export default function LoginClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // ✅ 로그인 성공 처리 (OAuth / 이메일 공통)
  useEffect(() => {
    if (searchParams.get('oauth') === 'success') {
      toast.success('로그인 성공 🎉');
      router.replace('/');
      router.refresh();
    }

    if (searchParams.get('login') === 'success') {
      toast.success('로그인 성공 🎉');
      router.replace('/');
      router.refresh();
    }
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-center font-semibold text-xl">Sign In</h1>

        {/* SNS 로그인 */}
        <div className="mb-4 flex flex-col gap-2">
          <GoogleLoginButton />
          <GithubLoginButton />
        </div>

        {/* 구분선 */}
        <div className="my-4 flex items-center gap-2">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-gray-400 text-xs">OR</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <SignForm />

        <p className="mt-4 text-center text-gray-600 text-sm">
          아직 회원이 아니신가요?{' '}
          <Link href="/signup" className="font-medium underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
