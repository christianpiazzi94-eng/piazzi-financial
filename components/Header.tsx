// components/Header.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight">
            <div className="h-7 w-7 rounded-full bg-[color:var(--header)]" aria-hidden />
            <span>Piazzi Financial Analysis</span>
          </Link>
          <nav className="hidden gap-6 md:flex text-sm font-medium text-gray-700">
            <Link href="/">Home</Link>
            <Link href="#insights">Insights</Link>
            <Link href="#subscribe">Subscribe</Link>
            <Link href="#">Contact</Link>
            <Link href="#">Login</Link>
          </nav>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden rounded-lg border px-3 py-1.5 text-sm"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Toggle menu"
          >
            Menu
          </button>
        </div>
        {open && (
          <div id="mobile-nav" className="pb-4 md:hidden">
            <nav className="grid gap-2 text-sm">
              <Link href="/">Home</Link>
              <Link href="#insights">Insights</Link>
              <Link href="#subscribe">Subscribe</Link>
              <Link href="#">Contact</Link>
              <Link href="#">Login</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
