// app/page.tsx
'use client'; // <-- 1. Add this to make it a Client Component

import { useState } from 'react'; // <-- 2. Import useState
import Hero from '../components/Hero';
import Section from '../components/Section';
// 3. Import the 'Tab' type from SectionTabs
import SectionTabs, { type Tab } from '../components/SectionTabs';
import InsightCard from '../components/InsightCard';

export default function Home() {
  // 4. Create state to manage the active tab
  const [activeTab, setActiveTab] = useState<Tab>('All Insights');

  return (
    <>
      <Hero />
      
      {/* 5. Pass the state and function down to the component */}
      <SectionTabs active={activeTab} onChange={setActiveTab} />

      {/* This section holds your grid of cards */}
      <Section>
        {/* Later, we will use 'activeTab' to filter this list */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <InsightCard />
          <InsightCard />
          <InsightCard />
          <InsightCard />
          <InsightCard />
          <InsightCard />
          <InsightCard />
          <InsightCard />
          <InsightCard />
        </div>
      </Section>
    </>
  );
}