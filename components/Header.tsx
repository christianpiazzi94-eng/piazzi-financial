// components/Header.tsx
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

// Simplified nav links (No change here)
const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Materials', href: '/materials' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Press Releases', href: '/press' },
  { name: 'About Us', href: '/about' },
];

// --- Substack URL UPDATED ---
const SUBSTACK_URL = "https://piazzifinancialanalysis.substack.com";
// ----------------------------

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-brand-lavender shadow-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* Left side: Just the Logo (No change) */}
        <Link href="/" className="flex flex-shrink-0 items-center">
          <Image
            src="/logo.svg"
            alt="Piazzi Financial Analysis Logo"
            width={168}
            height={168}
            className="h-24 w-auto"
            priority
          />
        </Link>

        {/* --- CHANGE: We have removed the separate "Center" div --- */}


        {/* --- CHANGE: Nav links are now INSIDE this "Right side" div --- */}
        <div className="hidden flex-shrink-0 items-center gap-6 md:flex">

          {/* These are your nav links, now on the right */}
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="whitespace-nowrap text-sm font-medium text-brand-dark transition hover:opacity-75"
            >
              {link.name}
            </Link>
          ))}

          {/* This is a visual separator (optional, but nice) */}
          <div className="h-6 w-px bg-gray-300" />

          {/* Your original Auth Buttons (No change to these) */}
          <SignedIn>
             <UserButton afterSignOutUrl="/" />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <span className="cursor-pointer whitespace-nowrap text-sm font-medium text-brand-dark transition hover:opacity-75">
                Log In
              </span>
            </SignInButton>
          </SignedOut>

          <Button asChild className="bg-brand-dark text-white hover:bg-brand-dark/90">
            <Link href={SUBSTACK_URL} target="_blank" rel="noopener noreferrer">Subscribe</Link>
          </Button>
        </div>

        {/* Mobile Menu Button (No change) */}
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

      {/* --- Mobile Menu Overlay (No change) --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-brand-dark bg-opacity-95 md:hidden">
          {/* ... all your mobile menu code remains exactly the same ... */}
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
            <SignedIn>
                 <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
                <SignInButton mode="modal">
                  <span onClick={() => setIsMobileMenuOpen(false)} className="cursor-pointer text-white hover:text-brand-lavender transition">
                      Log In
                  </span>
                </SignInButton>
            </SignedOut>
            <Button asChild size="lg" className="mt-4 bg-brand-lavender text-brand-dark hover:bg-brand-lavender/90">
               <Link href={SUBSTACK_URL} target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)}>Subscribe</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}