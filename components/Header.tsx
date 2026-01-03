// components/Header.tsx
import Link from 'next/link';

export default function Header() {
  return (
    <header className="h-14 px-6 flex items-center border-b">
      <Link href="/" className="text-lg font-bold hover:opacity-80">
        Doyi&apos;s Blog
      </Link>
    </header>
  );
}
