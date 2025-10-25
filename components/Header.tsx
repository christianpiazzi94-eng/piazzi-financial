// components/Header.tsx
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button'; // Shadcn Button

// Simplified nav links
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
      {/* Align with max-w-6xl layout width */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* Left side: Logo */}
        <Link href="/" className="flex flex-shrink-0 items-center">
          <Image
            src="/logo.svg" // Your SVG file
            alt="Piazzi Financial Analysis Logo"
            width={168} // Original width (aspect ratio)
            height={168} // Original height (aspect ratio)
            className="h-24 w-auto" // Sets visual size to 96px tall
            priority
          />
        </Link>

        {/* Center: Desktop Nav */}
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

        {/* Right side: Auth Buttons */}
        <div className="hidden flex-shrink-0 items-center gap-6 md:flex">
          <Link
            href="/login"
            className="whitespace-nowrap text-sm font-medium text-brand-dark transition hover:opacity-75"
          >
            Log In
          </Link>
          {/* Use Shadcn Button inside the Link */}
          <Button asChild className="bg-brand-dark text-white hover:bg-brand-dark/90">
            {/* VVV UPDATE THIS HREF VVV */}
            <Link href="https://subscribepage.io/zUEAS9" target="_blank" rel="noopener noreferrer">Subscribe</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
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

      {/* Mobile Menu Overlay */}
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
            {/* Use Shadcn Button in Mobile menu too */}
            <Button asChild size="lg" className="mt-4 bg-brand-lavender text-brand-dark hover:bg-brand-lavender/90">
              {/* VVV UPDATE THIS HREF VVV */}
               <Link href="https://subscribepage.io/zUEAS9" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)}>Subscribe</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}