'use client'; // needed because we use useState

import { useState } from 'react';
import SectionTabs, { type Tab } from '../components/SectionTabs';
import InsightCard from '../components/InsightCard';

/** Keep your inline Hero so there are no import issues */
function Hero() {
  return (
    <section className="relative h-[340px] md:h-[420px] w-full overflow-hidden rounded-none md:rounded-3xl">
      {/* Background image */}
      <img
        src="/hero.jpg"
        alt="Financial markets background"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      {/* Overlay tint */}
      <div className="absolute inset-0 bg-black/40" />
      {/* Text */}
      <div className="relative z-10 h-full max-w-6xl mx-auto px-6 flex flex-col items-center justify-center text-center text-white">
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight drop-shadow">
          Insights
        </h1>
        <a
          href="#subscribe"
          className="mt-6 inline-flex items-center rounded-xl bg-white text-[#167a61] font-semibold px-6 py-3 shadow hover:shadow-md transition"
        >
          SUBSCRIBE
        </a>
      </div>
    </section>
  );
}


export default function Page() {
  const [tab, setTab] = useState<Tab>('All Insights');

  return (
    <>
      <Hero />

      <SectionTabs active={tab} onChange={setTab} />

      <section className="py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-6">
            <h2 id="insights" className="text-xl font-semibold text-gray-800">
              {tab}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <InsightCard key={i} />
            ))}
          </div>

          <div id="subscribe" className="mt-16 rounded-2xl bg-white border p-6 text-center">
            <h3 className="text-lg font-semibold">Get new insights in your inbox</h3>
            <p className="text-sm text-gray-600 mt-1">
              Neutral wording if you’ll link to an external checkout later.
            </p>
            <a
              href="https://example.com/checkout"
              className="inline-flex items-center mt-4 rounded-xl bg-[#5C7AEA] px-5 py-3 font-semibold text-white hover:opacity-90 transition"
            >
              Continue to Website
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
