// components/Hero.tsx
// No 'use client' needed!

export default function Hero() {
  return (
    // Use brand-lavender for the background
    <section className="h-[400px] w-full bg-brand-lavender md:h-[500px]">
      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-6 text-left">
        {/* Main Heading: Use brand-dark */}
        <h1 className="font-serif text-5xl font-medium tracking-tight text-brand-dark md:text-6xl">
          Piazzi Financial Analysis
        </h1>

        {/* Subtitle: Use a slightly lighter dark color for hierarchy */}
        <p className="mt-4 max-w-2xl text-lg text-slate-700 md:text-xl">
          An investment holding company specializing in data-driven
          financial insights and long-term market analysis.
        </p>
      </div>
    </section>
  );
}