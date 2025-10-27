// components/InsightDisplay.tsx
'use client'; 

import { useState } from 'react';
import SectionTabs, { type Tab } from './SectionTabs'; // <-- 1. RE-IMPORT SectionTabs
import InsightCard from './InsightCard';             // Your existing card component
import Section from './Section';                     // Your existing section wrapper

// Define the structure of an insight
interface InsightStub {
  _id: string;
  title?: string;
  slug?: { current: string };
  summary?: string;
  category?: string; // <-- Must match the interface in page.tsx
}

// Define the props this component expects
interface InsightDisplayProps {
  allInsights: InsightStub[];
}

export default function InsightDisplay({ allInsights }: InsightDisplayProps) {
  // --- 2. BRING BACK THE STATE ---
  const [activeTab, setActiveTab] = useState<Tab>('All Insights');

  // --- 3. NEW FILTERING LOGIC ---
  const filteredInsights = allInsights.filter(insight => {
    // If tab is "All Insights", show everything
    if (activeTab === 'All Insights') {
      return true;
    }
    // Otherwise, check if the insight's category (lowercase)
    // matches the active tab (lowercase)
    return insight.category?.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <>
      {/* --- 4. RENDER TABS HERE --- */}
      <SectionTabs active={activeTab} onChange={setActiveTab} />

      {/* Render the section containing the filtered insight cards (your "boxes") */}
      <Section>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredInsights && filteredInsights.length > 0 ? (
            filteredInsights.map((insight) => (
              <InsightCard
                key={insight._id}
                title={insight.title ?? 'Untitled Insight'}
                summary={insight.summary}
                slug={insight.slug?.current}
              />
            ))
          ) : (
            // This shows the "No insights found" message
            <p className="text-slate-600 col-span-full">
              No insights found {activeTab !== 'All Insights' ? `for "${activeTab}"` : 'yet'}.
            </p>
          )}
        </div>
      </Section>
    </>
  );
}