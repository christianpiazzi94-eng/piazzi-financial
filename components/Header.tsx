// components/Header.tsx
import Image from 'next/image';
import Link from 'next/link';
// We need to import 'Route' to help TypeScript
import type { Route } from 'next';

// Updated navLinks to use valid placeholder routes instead of '#'
const navLinks: { name: string; href: Route }[] = [
  { name: 'Home', href: '/' },
  { name: 'Performance', href: '/performance' },
  { name: 'Materials', href: '/materials' },
  { name: 'Corporate', href: '/corporate' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Press Releases', href: '/press' },
  { name: 'About Us', href: '/about' },
];

export default function Header() {
  return (
    // Use brand-lavender for the background
    <header className="bg-brand-lavender shadow-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex flex-shrink-0 items-center gap-3">
            <Image
              src="/Lavender.png"
              alt="Piazzi Financial Analysis Logo"
              width={40}
              height={40}
              className="rounded"
            />
            <span className="hidden text-xl font-medium text-brand-dark sm:block">
              Piazzi Financial Analysis
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href} // This will now be a valid Route type
                className="text-sm font-medium text-brand-dark transition hover:opacity-75"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* --- NEW SECTION: AUTH BUTTONS --- */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/login" // This will also be a valid route
            className="text-sm font-medium text-brand-dark transition hover:opacity-75"
          >
            Log In
          </Link>
          <Link
            href="/subscribe" // This will also be a valid route
            className="rounded-lg bg-brand-dark px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-opacity-80"
          >
            Subscribe
          </Link>
        </div>

        {/* Mobile Menu Button (Placeholder) */}
        <div className="md:hidden">
          <button className="text-brand-dark">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}