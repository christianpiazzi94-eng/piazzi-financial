// components/Header.tsx
import Image from 'next/image';
import Link from 'next/link';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Performance', href: '#' },
  { name: 'Materials', href: '#' },
  { name: 'Corporate', href: '#' },
  { name: 'Portfolio', href: '#' },
  { name: 'Press Releases', href: '#' },
  { name: 'About Us', href: '#' },
];

export default function Header() {
  return (
    // Use brand-lavender for the background
    <header className="bg-brand-lavender shadow-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/Lavender.png"
            alt="Piazzi Financial Analysis Logo"
            width={40}
            height={40}
            className="rounded"
          />
          {/* Use brand-dark for the text */}
          <span className="hidden text-xl font-medium text-brand-dark sm:block">
            Piazzi Financial Analysis
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              // Use brand-dark for links, with a simple opacity hover effect
              className="text-sm font-medium text-brand-dark transition hover:opacity-75"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button (Placeholder) */}
        <div className="md:hidden">
          {/* Use brand-dark for the mobile icon */}
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