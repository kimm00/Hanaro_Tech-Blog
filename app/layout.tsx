// app/layout.tsx (Server Component 유지)
import './globals.css'; // ✅ Tailwind 필수

import { Toaster } from 'sonner';
import Header from '@/components/Header';
import { Separator } from '@/components/ui/separator';
import Providers from './providers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hanaro Blog',
  description: '개발 기록과 학습 로그를 정리하는 기술 블로그',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-background">
        <Providers>
          <Toaster position="top-right" richColors />

          <Header />

          <div className="h-6" />
          <Separator />

          {/* ❌ 여기서 잔디 제거 */}
          <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
