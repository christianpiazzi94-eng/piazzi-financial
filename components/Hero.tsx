// components/Hero.tsx
// No 'use client' needed!

import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative h-[340px] w-full overflow-hidden md:h-[420px] md:rounded-3xl">
      {/* Background image */}
      <Image
        src="/hero.jpg"
        alt="Financial markets background"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
        quality={80} // Explicitly set the quality
      />
      {/* Overlay tint */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#3A3797]/80 via-[#3A3797]/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-6 text-center text-white">
        <h1 className="text-5xl font-semibold tracking-tight drop-shadow md:text-6xl">
          Insights
        </h1>
        <Link
          href="#subscribe"
          aria-label="Subscribe to our newsletter" // Better for accessibility
          className="mt-6 inline-flex items-center rounded-xl bg-white px-6 py-3 font-semibold text-[#2E2B5F] shadow transition hover:bg-white/90"
        >
          SUBSCRIBE
        </Link>
      </div>
    </section>
  );
}