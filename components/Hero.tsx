// components/Hero.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative h-[340px] md:h-[420px] w-full rounded-none md:rounded-3xl overflow-hidden">
      {/* Background image */}
      <Image
        src="/hero.jpg"
        alt="Financial markets background"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      {/* Overlay tint */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#3A3797]/80 via-[#3A3797]/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full max-w-6xl mx-auto px-6 flex flex-col items-center justify-center text-center text-white">
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight drop-shadow">
          Insights
        </h1>
        <Link
          href="#subscribe"
          className="mt-6 inline-flex items-center rounded-xl bg-white text-[#2E2B5F] font-semibold px-6 py-3 shadow hover:bg-white/90 transition"
        >
          SUBSCRIBE
        </Link>
      </div>
    </section>
  );
}
