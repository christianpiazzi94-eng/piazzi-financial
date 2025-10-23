// components/Header.tsx
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

// New, simplified list of nav links
const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Materials', href: '/materials' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Press Releases', href: '/press' },
  { name: 'About Us', href: '/about' },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-brand-lavender shadow-md">
      {/* Set back to max-w-6xl to match your Hero and Section components */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        
        {/* Left side: Just the Logo */}
        <Link href="/" className="flex flex-shrink-0 items-center">
          <Image
            src="/Lavender.png"
            alt="Piazzi Financial Analysis Logo"
            width={168}  // 3x larger (was 56)
            height={168} // 3x larger (was 56)
            className="rounded"
          />
          {/* The "Piazzi Financial Analysis" text span is now REMOVED */}
        </Link>

        {/* Center: Desktop Nav Links (hidden on mobile) */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="whitespace-nowrap text-sm font-medium text-brand-dark transition hover:opacity-75"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right side: Auth Buttons (hidden on mobile) */}
        <div className="hidden flex-shrink-0 items-center gap-6 md:flex">
          <Link
            href="/login"
            className="whitespace-nowrap text-sm font-medium text-brand-dark transition hover:opacity-75"
          >
            Log In
          </Link>
          <Link
            href="/subscribe"
            className="whitespace-nowrap rounded-lg bg-brand-dark px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-opacity-80"
          >
            Subscribe
          </Link>
        </div>

        {/* Mobile Menu Button (Hamburger Icon - shown on mobile, hidden on desktop) */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-brand-dark focus:outline-none"
            aria-label="Open Mobile Menu"
          >
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24"
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

      {/* --- Mobile Menu Overlay --- */}
      {/* This part remains the same */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-brand-dark bg-opacity-95 md:hidden">
          <div className="flex justify-end p-6">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white focus:outline-none"
              aria-label="Close Mobile Menu"
            >
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex flex-col items-center gap-8 text-lg">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white hover:text-brand-lavender transition"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white hover:text-brand-lavender transition"
            >
              Log In
            </Link>
            <Link
              href="/subscribe"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-4 rounded-lg bg-brand-lavender px-6 py-3 text-lg font-semibold text-brand-dark shadow transition hover:bg-opacity-90"
            >
              Subscribe
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}